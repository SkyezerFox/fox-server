import { default as colors } from "colors/safe";
import { default as express, IRouterMatcher } from "express";
import * as http from "http";
import { default as morgan } from "morgan";
import * as winston from "winston";

import { Server } from "../Server";
import { createLoggerWithPrefix } from "../util/logging";
import { NotFound } from "./errors";

export declare interface RESTServer {
	server: Server;
	express: express.Application;
	logger: winston.Logger;

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

/**
 * Class for representing the server that handles HTTP REST client requests.
 */
export class RESTServer {
	public server: Server;
	public express: express.Application;
	public logger: winston.Logger;

	constructor(server: Server) {
		this.server = server;
		this.express = express();

		this.logger = createLoggerWithPrefix(colors.blue("http"));

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

		// Copy the use function to the server class.
		this.use = this.express.use.bind(this.express);

		// Bind requests to the logger, so we can get debug information
		this.use(
			morgan("common", {
				stream: {
					write: (info: string) => {
						info = info.replace(/(\r\n\t|\n|\r\t)/g, "");
						this.logger.info(info);
					},
				},
			})
		);
	}

	/**
	 * Open the server and start listening for requests.
	 */
	public init() {
		this.express.use("*", (req, res) => NotFound(res));
		this.server.http = http.createServer(this.express);

		return this;
	}

	/**
	 * Utility function for accessing server properties.
	 * @param {Function} routerCreator - Function that creates the router
	 */
	public withServer(...handles: Array<(server: this) => any>) {
		handles.forEach((handle) => handle(this));
	}

	/**
	 * Utility function for easily creating routers with access to the server class.
	 * @param {String} path Path the router should hook to
	 * @param {Funciton} handle Router handle function
	 */
	public router(path: string, handle: (server: this) => express.Router) {
		this.use(path, handle(this));
		return this;
	}
}
