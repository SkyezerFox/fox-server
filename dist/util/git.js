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
