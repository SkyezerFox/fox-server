import { default as chalk } from "chalk";
import * as http from "http";
import { default as ora } from "ora";
import * as winston from "winston";

import { SocketServer } from "./gateway/SocketServer";
import { RESTServer } from "./rest/RESTServer";
import { getCurrentHash, getCurrentTag } from "./util/git";
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

	public beforeStartTasks: ((server: Server) => any)[];

	constructor(options?: Partial<T>) {
		this.options = Object.assign(
			{
				debug: "info",
				disableWinston: false,
				port: 8080,
			},
			options
		) as T;

		// Create REST and Socket servers

		this.http = http.createServer();

		this.rest = new RESTServer(this);
		this.ws = new SocketServer(this);

		this.http.on("error", (err) =>
			console.log(
				`${chalk.magentaBright("http")} ${chalk.redBright(
					"error"
				)} ${err}`
			)
		);

		// process.on("exit", () => this.stop()).on("SIGTERM", () => this.stop());

		this.logger = createLoggerWithPrefix();

		this.beforeStartTasks = [];
	}

	/**
	 * Start the server.
	 */
	public async start() {
		charLog(
			`${chalk.yellowBright("fox-server")} ${chalk.greenBright(
				await getCurrentTag()
			)} ${chalk.grey(`on "${await getCurrentHash()}"`)}`
		);
		charLog(chalk.cyanBright("Preparing to bark...\n"));

		let spinner = ora({
			spinner: "dots",
		}).start("Attaching rest hooks...");

		this.rest.init();

		spinner.text = "Starting HTTP server...";
		this.http.listen(this.options.port);

		spinner.text = "Telling the socket server to initialize...";
		await this.ws.init();

		spinner.succeed("Server ready.");
		spinner.start(`${chalk.cyanBright("Running startup tasks")}`);

		for (let i = 0; i < this.beforeStartTasks.length; i++) {
			const task = this.beforeStartTasks[i];

			spinner.text = `${chalk.cyanBright(
				"Running startup tasks"
			)} - ${task.name || "anonymous"}`;

			try {
				await task(this);
			} catch (err) {
				spinner.stopAndPersist({
					symbol: chalk.redBright("error"),
					text: `Error in task ${i} "${task.name || "anonymous"}".`,
				});

				console.error(err);

				spinner.start(
					`[${i + 2}/${this.beforeStartTasks.length}] ${task.name ||
						"anonymous"}`
				);
			}
		}

		spinner.succeed("Background tasks complete.\n");

		charLog(
			`${chalk.yellow("BARK!!! ^w^")} - Listening on port ${
				this.options.port
			}.\n`
		);
	}

	/**
	 * Stop the server.
	 */
	public async stop() {
		await this.ws.close();
		this.http.close();
	}

	public async task(taskFunction: (...args: any[]) => any) {
		this.beforeStartTasks.push(taskFunction);
	}
}
