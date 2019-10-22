import { EventEmitter } from "events";
import * as http from "http";

import { SocketServer } from "./gateway/SocketServer";
import { RESTServer } from "./rest/RESTServer";
import { getCurrentHash } from "./util/git";

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
	port: number;
}

export declare interface Server extends EventEmitter {
	on(eventName: "debug", listener: (msg: string) => any): this;
	on(eventName: "ready", listener: () => any): this;
	on(eventName: "http", listener: (msg: string) => any): this;
	on(eventName: "ws", listener: (msg: string) => any): this;
	on(eventName: "exit", listener: () => any): this;
}

/**
 * Structure that represents the API HTTP REST server.
 *
 * @property {ServerOptions} options - Options to use when listening
 */
export class Server<
	T extends ServerOptions = ServerOptions
> extends EventEmitter {
	public options: T;

	public rest: RESTServer;
	public ws: SocketServer;

	public http: http.Server;

	constructor(options?: Partial<T>) {
		super();

		this.options = Object.assign(
			{
				debug: "info",
				port: 8080,
			},
			options
		) as T;

		// Create REST and Socket servers

		this.http = http.createServer();

		this.rest = new RESTServer(this);
		this.ws = new SocketServer(this);

		this.rest
			.on("debug", (msg) => this.emit("debug", msg))
			.on("http", (msg) => this.emit("http", msg));

		this.ws
			.on("debug", (msg) => this.emit("debug", msg))
			.on("ws", (msg) => this.emit("http", msg));

		process.on("exit", () => this.stop()).on("SIGTERM", () => this.stop());
	}

	/**
	 * Start the server.
	 */
	public async start() {
		this.emit(
			"debug",
			`[server] running on commit "${await getCurrentHash()}"`
		);

		this.rest.init();

		this.emit("debug", `[http] listening on port "${this.options.port}".`);
		this.http.listen(this.options.port);

		await this.ws.init();

		this.emit("ready");
	}

	/**
	 * Stop the server.
	 */
	public async stop() {
		this.emit("stop");

		await this.ws.close();

		this.emit("debug", "[http] closing the HTTP server...");
		this.http.close();

		this.emit("exit");
	}
}
