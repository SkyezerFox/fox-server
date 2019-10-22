import { Collection } from "discord.js";
import { EventEmitter } from "events";
import { IncomingMessage } from "http";
import * as winston from "winston";
import * as WebSocket from "ws";

import { Server } from "../Server";

export declare interface SocketServer extends EventEmitter {
	on(eventName: "debug", listener: (msg: string) => any): this;
	on(eventName: "ready", listener: () => any): this;
	on(eventName: "ws", listener: (msg: string) => any): this;
}

/**
 * Class for representing the socket server used for dynamic UI updates by the client.
 */
export class SocketServer extends EventEmitter {
	public server: Server;
	public ws?: WebSocket.Server;

	public connections: Map<string, { rq: IncomingMessage; s: WebSocket }>;

	constructor(server: Server) {
		super();
		this.server = server;

		this.connections = new Map();
	}

	/**
	 * Initialize the socket server and start listening for socket connections.
	 */
	public async init(): Promise<boolean> {
		this.emit("debug", "[ws] initializing socket server...");
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
				this.emit(
					"ws",
					`[ws] CLOSE ${rq.connection.remoteAddress ||
						"unknown"} ${c} - ${r}`
				)
			);
		});

		return new Promise((r, rs) => {
			if (this.ws) {
				this.ws.on("listening", () => {
					this.emit("ready");
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
		this.emit("debug", "[ws] Closing the socket server...");

		if (this.ws) {
			this.ws.close();
		}
	}
}
