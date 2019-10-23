import { exec } from "child_process";

/**
 * Get the current git repo hash.
 */
export const getCurrentHash = (): Promise<string> => {
	return new Promise((res) =>
		exec("git rev-parse HEAD", (err, stdout) => {
			if (err) {
				return res("unknown");
			}

			return res(stdout.slice(0, 7));
		})
	);
};

/**
 * Get the current git tag.
 */
export const getCurrentTag = (): Promise<string> => {
	return new Promise((res) =>
		exec("git describe --tags --abbrev=0", (err, stdout) => {
			if (err || stdout.startsWith("fatal")) {
				return res("unknown");
			}

			return res(stdout.replace(/\n/, ""));
		})
	);
};
