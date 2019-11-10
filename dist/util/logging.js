"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const winston = __importStar(require("winston"));
exports.charLog = (...msg) => console.log(chalk_1.default.grey("▶"), ...msg);
exports.createLoggerWithPrefix = (prefix = "") => winston.createLogger({
    format: winston.format.combine(winston.format.colorize(), winston.format.printf(({ level, message }) => {
        return `${prefix} ${level} ${message}`;
    })),
    level: "debug",
    transports: new winston.transports.Console(),
});
