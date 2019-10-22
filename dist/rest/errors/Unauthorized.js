"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthorized = (res) => res.status(401).json({
    code: 3,
    msg: "401: Unauthorized",
});
