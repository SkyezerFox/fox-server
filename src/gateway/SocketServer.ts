import { default as colors } from "colors/safe";
import { IncomingMessage } from "http";
import * as winston from "winston";
import * as WebSocket from "ws";

import { Server } from "../Server";
import { createLoggerWithPrefix } from "../util/logging";

/**
 * Class for representing the socket server used for dynamic UI updates by the client.
 */
export class SocketServer {
	public server: Server<any>;
	public ws?: WebSocket.Server;

	public logger: winston.Logger;
	public connections: Map<string, { rq: IncomingMessage; s: WebSocket }>;
	public connected: boolean;

	constructor(server: Server<any>) {
		this.server = server;

		this.logger = createLoggerWithPrefix(colors.yellow("ws"));
		this.connections = new Map();
		this.connected = false;
	}

	/**
	 * Initialize the socket server and start listening for socket connections.
	 */
	public init() {
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
