/**
 * Represents a error sendable by the server.
 */
export interface ServerError {
	code: number;
	msg: string;

	[x: string]: number | boolean | string | {};
}

export type ServerErrorCreator = (extras: {}) => typeof extras & ServerError;
