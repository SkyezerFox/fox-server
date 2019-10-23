"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServersideError = (res, details) => res.status(400).json({
    code: 4,
    msg: "500: Server Error",
    details,
});
