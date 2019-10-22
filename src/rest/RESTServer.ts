import { default as bodyParser } from "body-parser";
import { default as cors } from "cors";
import { EventEmitter } from "events";
import { default as express, Handler, IRouterMatcher, Router } from "express";
import * as http from "http";
import { default as morgan } from "morgan";

import { Server } from "../Server";
import { NotFound } from "./errors";

export declare interface RESTServer extends EventEmitter {
	server: Server;
	express: express.Application;

	checkout: IRouterMatcher<express.Application>;
	connect: IRouterMatcher<express.Application>;
	copy: IRouterMatcher<express.Application>;
	delete: IRouterMatcher<express.Application>;
	get: typeof express.application.get;
	head: IRouterMatcher<express.Application>;
	lock: IRouterMatcher<express.Application>;
	"m-search": IRouterMatcher<express.Application>;
	merge: IRouterMatcher<express.Application>;
	mkactivity: IRouterMatcher<express.Application>;
	mkcol: IRouterMatcher<express.Application>;
	move: IRouterMatcher<express.Application>;
	notify: IRouterMatcher<express.Application>;
	options: IRouterMatcher<express.Application>;
	patch: IRouterMatcher<express.Application>;
	post: IRouterMatcher<express.Application>;
	propfind: IRouterMatcher<express.Application>;
	proppatch: IRouterMatcher<express.Application>;
	purge: IRouterMatcher<express.Application>;
	put: IRouterMatcher<express.Application>;
	rebund: IRouterMatcher<express.Application>;
	report: IRouterMatcher<express.Application>;
	search: IRouterMatcher<express.Application>;
	source: IRouterMatcher<express.Application>;
	subscribe: IRouterMatcher<express.Application>;
	trace: IRouterMatcher<express.Application>;
	unbind: IRouterMatcher<express.Application>;
	unlink: IRouterMatcher<express.Application>;
	unlock: IRouterMatcher<express.Application>;
	unsubscribe: IRouterMatcher<express.Application>;

	use: typeof express.application.use;
}

export declare interface RESTServer extends EventEmitter {
	on(eventName: "debug", listener: (msg: string) => any): this;
	on(eventName: "ready", listener: () => any): this;
	on(eventName: "http", listener: (msg: string) => any): this;
}

/**
 * Class for representing the server that handles HTTP REST client requests.
 */
export class RESTServer extends EventEmitter {
	public server: Server;

	public express: express.Application;

	constructor(server: Server) {
		super();

		this.server = server;

		this.express = express();

		// Iterate through HTTP methods and create functions for them.
		http.METHODS.forEach((method) => {
			type RequestHandlerFunction = (
				...handlers: express.RequestHandler[]
			) => express.Application;

			const requestHandlerFunction = (<any>this.express)[
				method.toLowerCase()
			] as (undefined | RequestHandlerFunction);

			if (requestHandlerFunction) {
				Object.defineProperty(
					this,
					method.toLowerCase(),
					requestHandlerFunction
				);
			}
		});

		// Bind requests to the logger, so we can get debug information
		this.use(
			morgan(this.server.options.debug === "debug" ? "common" : "dev", {
				stream: {
					write: (info: string) => {
						info = info.replace(/(\r\n\t|\n|\r\t)/g, "");
						this.emit("http", info);
					},
				},
			})
		);

		this.use(cors());
		this.use(bodyParser.json());
	}

	/**
	 * Open the server and start listening for requests.
	 */
	public init() {
		this.express.use("*", (req, res) => NotFound(res));
		this.server.http = http.createServer(this.express);

		this.emit("debug", `[rest] http hooks attached.`);

		return this;
	}

	/**
	 * Create a router to use for the server.
	 * @param {String} path - Path to use for the handler
	 * @param {Function} routerCreator - Function that creates the router
	 */
	public withServer(
		...definitions:
			| [string, (server: Server) => express.Router][]
			| [string, (server: Server) => express.Router]
	) {
		if (typeof definitions[0] === "string") {
			definitions = definitions as [
				string,
				(server: Server) => express.Router
			];
			this.use(definitions[0], definitions[1](this.server));
		} else {
			definitions = definitions as [
				string,
				(server: Server) => express.Router
			][];
			definitions.forEach(
				(def: [string, (server: Server) => express.Router]) =>
					this.use(def[0], def[1](this.server))
			);
		}
	}
}
