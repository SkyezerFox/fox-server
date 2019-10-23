import { default as chalk } from "chalk";

export const charLog = (...msg: string[]) =>
	console.log(chalk.grey("⯈"), ...msg);
