"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = (res) => res.status(404).json({
    code: 0,
    msg: `404: Not Found`,
});
