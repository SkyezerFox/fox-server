import { default as chalk } from "chalk";
import { IncomingMessage } from "http";
import * as winston from "winston";
import * as WebSocket from "ws";

import { Server } from "../Server";
import { createLoggerWithPrefix } from "../util/logging";

/**
 * Class for representing the socket server used for dynamic UI updates by the client.
 */
export class SocketServer {
	public server: Server;
	public ws?: WebSocket.Server;

	public logger: winston.Logger;

	public connections: Map<string, { rq: IncomingMessage; s: WebSocket }>;

	constructor(server: Server) {
		this.server = server;

		this.logger = createLoggerWithPrefix(chalk.yellow("ws"));

		this.connections = new Map();
	}

	/**
	 * Initialize the socket server and start listening for socket connections.
	 */
	public async init(): Promise<boolean> {
		this.ws = new WebSocket.Server({
			path: "/gateway",
			server: this.server.http,
		});

		this.ws.on("connection", (s, rq) => {
			if (rq.connection.remoteAddress) {
				this.connections.set(rq.connection.remoteAddress, {
					rq,
					s: s as WebSocket,
				});
			}

			s.on("close", (c, r) =>
				console.log(
					"ws",
					`[ws] CLOSE ${rq.connection.remoteAddress ||
						"unknown"} ${c} - ${r}`
				)
			);
		});

		return new Promise<boolean>((r, rs) => {
			if (this.ws) {
				this.ws.once("listening", () => {
					r(true);
				});
			} else {
				rs(false);
			}
		});
	}

	/**
	 * Close the socket server and stop listening/close socket connections.
	 */
	public async close() {
		if (this.ws) {
			this.ws.close();
		}
	}
}
