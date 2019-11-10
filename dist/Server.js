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
const safe_1 = __importDefault(require("colors/safe"));
const http = __importStar(require("http"));
const ora_1 = __importDefault(require("ora"));
const SocketServer_1 = require("./gateway/SocketServer");
const RESTServer_1 = require("./rest/RESTServer");
const checkVersion_1 = require("./util/checkVersion");
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
            disableAnimations: process.platform === "win32",
            port: 8080,
            versionChecking: true,
        }, options);
        // Create REST and Socket servers
        this.http = http.createServer();
        this.rest = new RESTServer_1.RESTServer(this);
        this.ws = new SocketServer_1.SocketServer(this);
        this.http.on("error", (err) => console.log(`${safe_1.default.magenta("http")} ${safe_1.default.red("error")} ${err}`));
        process.on("SIGINT", () => {
            process.exit();
        });
        this.logger = logging_1.createLoggerWithPrefix();
        this.beforeStartTasks = [];
        this.afterStartTasks = [];
        const initializeRestHooks = () => this.rest.init(), initializeHTTPServer = () => new Promise((r) => this.http.listen(this.options.port, r)), initializeWSServer = () => this.ws.init();
        this.serverStartupTasks = [
            initializeRestHooks,
            initializeHTTPServer,
            initializeWSServer,
        ];
    }
    /**
     * Iterate over a list of tasks.
     * @param taskList
     */
    async _iterateOverTasks(spinner, taskList) {
        const taskListName = spinner.text;
        let errorCount = 0;
        for (let i in taskList) {
            const task = taskList[i];
            const taskName = task.name != "" ? task.name : "anonymous";
            spinner.start(`${safe_1.default.blue(taskListName)} - ${taskName}`);
            try {
                await task(this);
            }
            catch (err) {
                if (errorCount === 0) {
                    spinner.stop();
                    console.log("");
                }
                spinner.fail(`Error in task "${taskName}" (${Number(i) + 1} of ${taskList.length}).`);
                console.error(err + "\n");
                errorCount += 1;
            }
        }
    }
    /**
     * Iterate over a list of tasks without using CLI spinners.
     * @param taskList
     */
    async _iterateOverTasksWithoutAnimation(taskList) {
        for (let i in taskList) {
            const task = taskList[i];
            console.log(safe_1.default.grey(`[${Number(i) + 1}/${taskList.length}] ` +
                (task.name !== ""
                    ? task.name
                    : "anonymous" || "anonymous")));
            try {
                await task(this);
            }
            catch (err) {
                console.error(safe_1.default.red("error"), `Error in task "${task.name || "anonymous"}" (${i + 1} of ${taskList.length}).`);
                console.error(err);
            }
        }
        console.log("");
    }
    async _start() {
        let spinner = ora_1.default({
            spinner: "dots",
            text: "Starting server...",
        });
        if (this.beforeStartTasks.length > 0) {
            spinner.start(safe_1.default.blue("beforeStartupTasks"));
            await this._iterateOverTasks(spinner, this.beforeStartTasks);
            spinner.succeed(safe_1.default.blue("beforeStartupTasks"));
        }
        spinner.start(safe_1.default.blue("serverStartupTasks"));
        await this._iterateOverTasks(spinner, this.serverStartupTasks);
        spinner.succeed(safe_1.default.blue("serverStartupTasks"));
        if (this.afterStartTasks.length > 0) {
            spinner.start(safe_1.default.blue("afterStartupTasks"));
            await this._iterateOverTasks(spinner, this.afterStartTasks);
            spinner.succeed(safe_1.default.blue("afterStartupTasks"));
        }
    }
    /**
     * Start the server without using console animations.
     */
    async _startWithoutAnimations() {
        if (this.beforeStartTasks.length > 0) {
            console.log(safe_1.default.blue("beforeStartTasks"));
            await this._iterateOverTasksWithoutAnimation(this.beforeStartTasks);
        }
        console.log(safe_1.default.blue("serverStartupTasks"));
        await this._iterateOverTasksWithoutAnimation(this.serverStartupTasks);
        if (this.afterStartTasks.length > 0) {
            console.log(safe_1.default.blue("afterStartTasks"));
            await this._iterateOverTasksWithoutAnimation(this.afterStartTasks);
        }
    }
    /**
     * Start the server.
     */
    async start() {
        console.log(`\n${safe_1.default.yellow("fox-server")} ${safe_1.default.green(`v${require("../package.json").version} ${this.options.versionChecking ? await checkVersion_1.checkVersion() : ""}`)}\n`);
        logging_1.charLog("Preparing to bark...\n");
        if (this.options.disableAnimations) {
            await this._startWithoutAnimations();
        }
        else {
            await this._start();
        }
        console.log(`\n${safe_1.default.yellow("BARK!!! ^w^")} - Listening on port ${this.options.port}.\n`);
        return this;
    }
    /**
     * Stop the server.
     */
    async stop() {
        await this.ws.close();
        this.http.close();
    }
    /**
     * Add tasks to run before the server starts.
     * @param taskFunctions
     */
    before(...taskFunctions) {
        this.beforeStartTasks = this.beforeStartTasks.concat(taskFunctions);
        return this;
    }
    /**
     * Add tasks to run after the server has begun listening.
     * @param taskFunctions
     */
    after(...taskFunctions) {
        this.afterStartTasks = this.afterStartTasks.concat(taskFunctions);
        return this;
    }
}
exports.Server = Server;
