import { default as colors } from "colors/safe";
import * as http from "http";
import { default as ora } from "ora";
import * as winston from "winston";

import { SocketServer } from "./gateway/SocketServer";
import { RESTServer } from "./rest/RESTServer";
import { checkVersion } from "./util/checkVersion";
import { charLog, createLoggerWithPrefix } from "./util/logging";

/**
 * Options to use for the server during runtime.
 *
 * @typedef ServerOptions
 *
 *
 * @property {string} dbUri - The URI to use when connecting to the database
 * @property {"debug"|"verbose"|"info"} debug - Whether to enable debug logging
 * @property {number} port - The port to listen on
 */
export interface ServerOptions {
	debug: "debug" | "verbose" | "info";
	disableWinston: boolean;
	disableAnimations: boolean;
	versionChecking: boolean;
	port: number;
}

/**
 * Structure that represents the API HTTP REST server.
 *
 * @property {ServerOptions} options - Options to use when listening
 */
export class Server<T extends ServerOptions = ServerOptions> {
	public options: T;

	public http: http.Server;
	public rest: RESTServer;
	public ws: SocketServer;

	public logger: winston.Logger;

	public beforeStartTasks: ((server: Server<T>, ...args: any[]) => any)[];
	public afterStartTasks: ((server: Server<T>, ...args: any[]) => any)[];

	public serverStartupTasks: ((server: Server<T>, ...args: any[]) => any)[];

	constructor(options?: Partial<T>) {
		this.options = Object.assign(
			{
				debug: "info",
				disableWinston: false,
				disableAnimations: process.platform === "win32",
				port: 8080,
				versionChecking: true,
			},
			options
		) as T;

		// Create REST and Socket servers

		this.http = http.createServer();

		this.rest = new RESTServer(this);
		this.ws = new SocketServer(this);

		this.http.on("error", (err) =>
			console.log(
				`${colors.magenta("http")} ${colors.red("error")} ${err}`
			)
		);

		process.on("SIGINT", () => {
			process.exit();
		});

		this.logger = createLoggerWithPrefix();

		this.beforeStartTasks = [];
		this.afterStartTasks = [];

		const initializeRestHooks = () => this.rest.init(),
			initializeHTTPServer = () =>
				new Promise((r) => this.http.listen(this.options.port, r)),
			initializeWSServer = () => this.ws.init();

		this.serverStartupTasks = [
			initializeRestHooks,
			initializeHTTPServer,
			initializeWSServer,
		];
	}

	/**
	 * Iterate over a list of tasks.
	 * @param taskList
	 */
	private async _iterateOverTasks(
		spinner: ora.Ora,
		taskList: ((server: Server<T>, ...args: any[]) => any)[]
	) {
		const taskListName = spinner.text;
		let errorCount = 0;

		for (let i in taskList) {
			const task = taskList[i];
			const taskName = task.name != "" ? task.name : "anonymous";

			spinner.start(`${colors.blue(taskListName)} - ${taskName}`);

			try {
				await task(this);
			} catch (err) {
				if (errorCount === 0) {
					spinner.stop();
					console.log("");
				}

				spinner.fail(
					`Error in task "${taskName}" (${Number(i) + 1} of ${
						taskList.length
					}).`
				);

				console.error(err + "\n");
				errorCount += 1;
			}
		}
	}

	/**
	 * Iterate over a list of tasks without using CLI spinners.
	 * @param taskList
	 */
	private async _iterateOverTasksWithoutAnimation(
		taskList: ((server: Server<T>, ...args: any[]) => any)[]
	) {
		for (let i in taskList) {
			const task = taskList[i];

			console.log(
				colors.grey(
					`[${Number(i) + 1}/${taskList.length}] ` +
						(task.name !== ""
							? task.name
							: "anonymous" || "anonymous")
				)
			);

			try {
				await task(this);
			} catch (err) {
				console.error(
					colors.red("error"),
					`Error in task "${task.name || "anonymous"}" (${i + 1} of ${
						taskList.length
					}).`
				);

				console.error(err);
			}
		}

		console.log("");
	}

	private async _start() {
		let spinner = ora({ spinner: "dots", text: "Starting server..." });

		if (this.beforeStartTasks.length > 0) {
			spinner.start(colors.blue("beforeStartupTasks"));
			await this._iterateOverTasks(spinner, this.beforeStartTasks);
			spinner.succeed(colors.blue("beforeStartupTasks"));
		}

		spinner.start(colors.blue("serverStartupTasks"));
		await this._iterateOverTasks(spinner, this.serverStartupTasks);
		spinner.succeed(colors.blue("serverStartupTasks"));

		if (this.afterStartTasks.length > 0) {
			spinner.start(colors.blue("afterStartupTasks"));
			await this._iterateOverTasks(spinner, this.afterStartTasks);
			spinner.succeed(colors.blue("afterStartupTasks"));
		}
	}

	/**
	 * Start the server without using console animations.
	 */
	private async _startWithoutAnimations() {
		if (this.beforeStartTasks.length > 0) {
			console.log(colors.blue("beforeStartTasks"));
			await this._iterateOverTasksWithoutAnimation(this.beforeStartTasks);
		}

		console.log(colors.blue("serverStartupTasks"));
		await this._iterateOverTasksWithoutAnimation(this.serverStartupTasks);

		if (this.afterStartTasks.length > 0) {
			console.log(colors.blue("afterStartTasks"));
			await this._iterateOverTasksWithoutAnimation(this.afterStartTasks);
		}
	}

	/**
	 * Start the server.
	 */
	public async start() {
		console.log(
			`\n${colors.yellow("fox-server")} ${colors.green(
				`v${require("../package.json").version} ${
					this.options.versionChecking ? await checkVersion() : ""
				}`
			)}\n`
		);

		charLog("Preparing to bark...\n");

		if (this.options.disableAnimations) {
			await this._startWithoutAnimations();
		} else {
			await this._start();
		}

		console.log(
			`\n${colors.yellow("BARK!!! ^w^")} - Listening on port ${
				this.options.port
			}.\n`
		);

		return this;
	}

	/**
	 * Stop the server.
	 */
	public async stop() {
		await this.ws.close();
		this.http.close();
	}

	public async task(
		...taskFunctions: Array<(server: Server<T>, ...args: any[]) => any>
	) {
		this.beforeStartTasks = this.beforeStartTasks.concat(taskFunctions);
	}
}
