"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FoxServer_1 = require("./FoxServer");
exports.FoxServer = FoxServer_1.FoxServer;
var RESTServer_1 = require("./rest/RESTServer");
exports.RESTServer = RESTServer_1.RESTServer;
var SocketServer_1 = require("./gateway/SocketServer");
exports.SocketServer = SocketServer_1.SocketServer;
const Errors = __importStar(require("./rest/errors"));
exports.Errors = Errors;
