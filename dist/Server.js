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
const http = __importStar(require("http"));
const ora_1 = __importDefault(require("ora"));
const SocketServer_1 = require("./gateway/SocketServer");
const RESTServer_1 = require("./rest/RESTServer");
const git_1 = require("./util/git");
const logging_1 = require("./util/logging");
/**
 * Structure that represents the API HTTP REST server.
 *
 * @property {ServerOptions} options - Options to use when listening
 */
class Server {
    constructor(options) {
        this.options = Object.assign({
            debug: "info",
            disableWinston: false,
            port: 8080,
        }, options);
        // Create REST and Socket servers
        this.http = http.createServer();
        this.rest = new RESTServer_1.RESTServer(this);
        this.ws = new SocketServer_1.SocketServer(this);
        this.http.on("error", (err) => console.log(`${chalk_1.default.magentaBright("http")} ${chalk_1.default.redBright("error")} ${err}`));
        // process.on("exit", () => this.stop()).on("SIGTERM", () => this.stop());
        this.beforeStartTasks = [];
    }
    /**
     * Start the server.
     */
    async start() {
        logging_1.charLog(`${chalk_1.default.yellowBright("fox-server")} ${chalk_1.default.greenBright(await git_1.getCurrentTag())} ${chalk_1.default.grey(`on "${await git_1.getCurrentHash()}"`)} :3`);
        logging_1.charLog(chalk_1.default.cyanBright("Preparing to bark...\n"));
        let spinner = ora_1.default({
            spinner: "dots",
        }).start("Attaching rest hooks...");
        this.rest.init();
        spinner.text = "Starting HTTP server...";
        this.http.listen(this.options.port);
        spinner.text = "Telling the socket server to initialize...";
        await this.ws.init();
        spinner.succeed("Server ready.");
        spinner.start(`${chalk_1.default.cyanBright("Running startup tasks")}`);
        for (let i = 0; i < this.beforeStartTasks.length; i++) {
            const task = this.beforeStartTasks[i];
            spinner.text = `${chalk_1.default.cyanBright("Running startup tasks")} - ${task.name || "anonymous"}`;
            try {
                await task(this);
            }
            catch (err) {
                spinner.stopAndPersist({
                    symbol: chalk_1.default.redBright("error"),
                    text: `Error in task ${i} "${task.name || "anonymous"}".`,
                });
                console.error(err);
                spinner.start(`[${i + 2}/${this.beforeStartTasks.length}] ${task.name ||
                    "anonymous"}`);
            }
        }
        spinner.succeed("Background tasks complete.\n");
        logging_1.charLog(`${chalk_1.default.yellow("BARK!!! ^w^")} - Listening on port ${this.options.port}.\n`);
    }
    /**
     * Stop the server.
     */
    async stop() {
        await this.ws.close();
        this.http.close();
    }
    async task(taskFunction) {
        this.beforeStartTasks.push(taskFunction);
    }
}
exports.Server = Server;
