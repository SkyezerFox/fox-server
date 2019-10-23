import * as express from "express";

import { Server } from "../../Server";

export type ServerHandler = (
	server: Server,
	request: express.Request,
	response: express.Response,
	next: express.NextFunction,
) => any;
