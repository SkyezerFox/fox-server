import { Response } from "express";

import { NotFound } from "./NotFound";
import { ServerError } from "./ServerError";

interface ErrorCodes {
	/**
	 * Register a code mapping FoxServer codes to Express status codes.
	 * @param codeIn The FoxServer code
	 * @param codeOut The HTTP status code
	 */
	registerCode: (codeIn: number, codeOut: number) => this;

	/**
	 * Deregister a code mapping FoxServer codes to Express status codes.
	 * @param codeIn The FoxServer code
	 */
	deregisterCode: (codeIn: number) => this;

	/**
	 * Override the code mapping FoxServer codes to Express status codes.
	 * @param codes An object of code maps
	 */
	overrideCodes: (codes: { [x: number]: number }) => this;

	[x: number]: number;
}

export const ErrorCodes: ErrorCodes = {
	0: 404,
	1: 400,
	2: 421,
	3: 500,

	registerCode: function(codeIn: number, codeOut: number) {
		this[codeIn] = codeOut;
		return this;
	},

	deregisterCode: function(codeIn: number) {
		delete this[codeIn];
		return this;
	},

	overrideCodes: function(codes: { [x: number]: number }) {
		Object.assign(this, codes);

		return this;
	},
};

interface ServerErrors {
	[x: number]: ServerError;

	/**
	 * Add an error to the ServerErrors map.
	 */
	registerError: (code: number, error: ServerError) => this;

	/**
	 * Remove an error from the ServerErrors map.
	 */
	deregisterError: (code: number, error: ServerError) => this;
}

export const ServerErrors: ServerErrors = {
	0: NotFound,

	registerError: function(code: number, error: ServerError) {
		return this;
	},

	deregisterError: function(codeIn: number) {
		return this;
	},
};

/**
 * Utility function for quickly creating server error objects.
 * @param code The error code to use
 * @param msg The message to send in the error
 * @param extras Extra object fields
 */
export const createError = (
	code: number,
	msg: string,
	extras?: {}
): ServerError =>
	Object.assign(
		{
			code,
			msg,
		},
		extras
	);

/**
 * Utility function to send error response to the client.
 *
 * Automatically sets the response status code from the `ErrorCodes` object.
 * If no equivalent code is found, the status code is set to `code`.
 *
 * @param res Express response object
 * @param code The error code to use
 * @param msg The message to send in the error
 * @param extras Extra object fields
 */
export const sendError = (
	res: Response,
	code: number,
	msg: string,
	extras?: {}
) => res.status(ErrorCodes[code] || code).json(createError(code, msg, extras));

/**
 * Utility function to send error response to the client without inferring an appropriate status code.
 *
 * @param res Express response object
 * @param code The error code to use
 * @param msg The message to send in the error
 * @param extras Extra object fields
 */
export const sendCodelessError = (
	res: Response,
	code: number,
	msg: string,
	extras?: {}
) => res.json(createError(code, msg, extras));
