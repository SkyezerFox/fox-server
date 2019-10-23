import { default as chalk } from "chalk";
import * as winston from "winston";

export const charLog = (...msg: string[]) =>
	console.log(chalk.grey("⯈"), ...msg);

export const createLoggerWithPrefix = (prefix: string = "") =>
	winston.createLogger({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.printf(({ level, message }) => {
				return `${prefix} ${level} ${message}`;
			})
		),
		transports: new winston.transports.Console(),
	});
