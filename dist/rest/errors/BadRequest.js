"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequest = (res, details) => res.status(400).json({
    code: 1,
    msg: "400: Bad Request",
    details,
});
