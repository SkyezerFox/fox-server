import { exec } from "child_process";

/**
 * Get the current git repo hash.
 */
export const getCurrentHash = () => {
	return new Promise((res) =>
		exec("git rev-parse HEAD", (err, stdout) => {
			if (err) {
				return res("unknown");
			}

			return res(stdout.slice(0, 7));
		}),
	);
};
