import colors from "colors";
import * as winston from "winston";

export const charLog = (...msg: string[]) =>
	console.log(colors.grey("▶"), ...msg);

export const createLoggerWithPrefix = (prefix: string = "") =>
	winston.createLogger({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.printf(({ level, message }) => {
				return `${prefix} ${level} ${message}`;
			})
		),
		level: "debug",
		transports: new winston.transports.Console(),
	});
