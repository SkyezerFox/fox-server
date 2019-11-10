"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const compare_versions_1 = require("compare-versions");
const path_1 = require("path");
/**
 * Check the local version with the remote.
 */
exports.checkVersion = async () => {
    const pkg = require("../../package.json");
    if (!pkg.repository) {
        return "";
    }
    const request = await axios_1.default
        .get(path_1.join(pkg.repository, "blob/master/package.json"))
        .catch(() => ({ data: {} }));
    if (!request.data.version) {
        return "";
    }
    if (compare_versions_1.compare(pkg.version, request.data.version, "<")) {
        return `- Update available: ${request.data.version}`;
    }
    else {
        return "";
    }
};
