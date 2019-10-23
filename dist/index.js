"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Server_1 = require("./Server");
exports.FoxServer = Server_1.Server;
var RESTServer_1 = require("./rest/RESTServer");
exports.RESTServer = RESTServer_1.RESTServer;
var SocketServer_1 = require("./gateway/SocketServer");
exports.SocketServer = SocketServer_1.SocketServer;
