"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
/**
 * Get the current git repo hash.
 */
exports.getCurrentHash = () => {
    return new Promise((res) => child_process_1.exec("git rev-parse HEAD", (err, stdout) => {
        if (err) {
            return res("unknown");
        }
        return res(stdout.slice(0, 7));
    }));
};
/**
 * Get the current git tag.
 */
exports.getCurrentTag = () => {
    return new Promise((res) => child_process_1.exec("git describe --tags --abbrev=0", (err, stdout) => {
        if (err || stdout.startsWith("fatal")) {
            return res("unknown");
        }
        return res(stdout.replace(/\n/, ""));
    }));
};
