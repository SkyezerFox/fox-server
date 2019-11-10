import axios from "axios";
import { compare } from "compare-versions";
import { join } from "path";

/**
 * Check the local version with the remote.
 */
export const checkVersion = async () => {
	const pkg = require("../../package.json");

	if (!pkg.repository) {
		return "";
	}

	const request = await axios
		.get(join(pkg.repository, "blob/master/package.json"))
		.catch(() => ({ data: {} }));

	if (!request.data.version) {
		return "";
	}

	if (compare(pkg.version, request.data.version, "<")) {
		return `- Update available: ${request.data.version}`;
	} else {
		return "";
	}
};
