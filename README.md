# fox-server ![build status](https://github.com/orifoxx/fox-server/workflows/Mocha%20Test%20Suite/badge.svg)

**fox-server** is a boilerplate HTTP and WS server, with [express](https://npmjs.com/package/express) and [ws](https://npmjs.com/package/ws) being used under the hood.

## Features

-   Configurable HTTP logging using [morgan](https://npmjs.com/package/morgan)
-   Custom WS event logging
-   Built-in [winston](https://npmjs.com/package/winston) loggers for event-streaming and file-rotated logging
-   Fully asynchronous, sequential pre/post-listen action running

## Documentation

```ts
import { FoxServer } from "fox-server";
// Using require:
const { FoxServer } = require("fox-server");

const server = new FoxServer(opts: ServerOptions)
    .before(
        () => console.log("Runs before the server begins listening for requests"),
    ).after(
        () => console.log("Runs after the server has opened"),
    );

```

## Class: FoxServer

The `FoxServer` is the base class used to represent the compined REST and WS server.

## new FoxServer([options])

-   options {ServerOptions} Set of configurable options to set on the server.
    -   `debug` {"debug" | "verbose" | "info"} Controls the base level of logging that gets outputted to the console. **Default:** `"info"`.
    -   `disableAnimations` {boolean} Prevent the server from using console spinners while loading. By default, this is true on Windows since the feature was very glitchy. **Default:** `false`.
    -   `disableWinston` {boolean} Whether or not to disable winston logging. **Default:** `true`.
    -   `disableRESTServer` {boolean} Disables the REST server, preventing HTTP requests from being routed. **Default:** `false`.
    -   `disableSocketServer` {boolean} Disables the socket server, preventing WS upgrade requests from being handled. **Default:** `false`.
    -   `versionChecking` {boolean} By default, each FoxServer instance compares the version on the remote GitHub repository to ensure it's up to date. Normally, this has little impact on load times, but can be disabled by setting this to false. **Default:** `true`.
    -   `port` {number} The port which the server will listen on. This applies both to the REST and WS servers. **Default:** `3000`.

The base server that does all the fun things.

`ServerOptions` can easily be extended to accomodate your needs using type parameters. However, any options must extend the base `ServerOptions` object.

```ts
interface MyOptions extends ServerOptions {
	hello: string;
}

const server = new FoxServer<MyOptions>({ hello: "world!" });
```

### FoxServer.start()

-   Returns {Promise\<FoxServer\>}

Starts the server, triggering the execution of any functions specified using [`FoxServer.before()`][], before initializing the REST and WS servers.

### FoxServer.stop()

-   Returns {Promise\<FoxServer\>}

Stops the server, closing the HTTP server and running any functions registered using [`FoxServer.exit()`][].

### FoxServer.before(\...tasks\)

-   `...tasks` {Array\<(server: FoxServer) => any\>} The functions to be registered and called during server initialization. Each function will have the server instance parsed as a first argument to allow functions from different files to be used easily.
-   Returns {FoxServer}

Registers a function called after the server instance starts listening.

Functions will be executed in the order of registration.

### FoxServer.after(\...tasks\)

-   `...tasks` {Array\<(server: FoxServer) => any\>} The functions to be registered and called during server initialization.
-   Returns {FoxServer}

Registers a function called before the server instance starts listening.

Functions will be executed in the order of registration.

### FoxServer.exit(\...tasks\)

-   `...tasks` {Array\<(server: FoxServer) => any\>} The functions to be registered and called during server exit.
-   Returns {FoxServer}

Registers a function called before the server instance exits.

Functions will be executed in the order of registration.

This is practically equivalent to `process.on("SIGTERM", ...)`.

### FoxServer.http

-   {http.Server}

The HTTP server used to handle REST and WS upgrade requests. You can directly modify the server itself if you so desire. You can read the documentation for the server object on [NodeJS's official documentation](https://nodejs.org/api/http.html#http_class_http_server/).

### FoxServer.rest

-   {RESTServer}

The REST endpoint manager used for handling HTTP requests to the server. This uses [express](https://npmjs.com/packages/express) under the hood, which can be directly accessed on the [`RESTServer.express`][] property.

### FoxServer.ws

-   {SocketServer}

The SocketServer for handling WS events sent to/from the server. This uses [ws](https://npmjs.com/packages/ws) under the hood.

### FoxServer.beforeStartTasks

-   {Array\<(server: FoxServer) => any\>}

The array of handlers registered using [`FoxServer.before()`][] that get called before server initialization.

### FoxServer.afterStartTasks

-   {Array\<(server: FoxServer) => any\>}

The array of handlers registered using [`FoxServer.after()`][] that get called before server initialization.

### FoxServer.exitTasks

-   {Array\<(server: FoxServer) => any\>}

The array of handlers registered using [`FoxServer.exit()`][] that get called before server exit.

### FoxServer.serverStartupTasks

-   {Array\<(server: FoxServer) => any\>}

The built-in array of tasks performed to initialize the server. **I don't recommend modifying this unless you know what you're doing.**

## Class: RESTServer

The `RESTServer` class handles REST API requests made to the server via HTTP. Requests are handled using [express](https://npmjs.com/package/express) under the hood, having been routed through the HTTP server on [`FoxServer.http`][].

Each instance of the `RESTServer` class has the typical express handling functions (`app.get(() => ...)`, `app.use(() => ...)`) which directly interface with express itself.

### RESTServer.router(path, handle)

-   `path` {String} The path on which to create the router.
-   `handle` {(server: RESTServer) => express.Router} A function taking the RESTServer object and returning a valid express Router function.

`RESETServer.router()` can be used to create nested express routers that maintain access to the server object itself.

### RESTServer.express

-   {express.Application}

The raw express instance being used to handle requests. This can be directly modified as needed, although using the request functions built into the RESTServer itself is equivalent to modifying this object.

## Class: SocketServer

The `SocketServer` class represents the extended [ws](https://npmjs.com/package/ws) `SocketServer` which handles WebSocket connections and upgrade requests made to the server.

<!-- FoxServer Links -->

[`foxserver.before()`]: #foxserver.before_tasks
[`foxserver.after()`]: #foxserver.after_tasks
[`foxserver.exit()`]: #foxserver.exit_tasks
[`foxserver.http`]: #foxserver.http

<!-- RESTServer Links -->

[`restserver.express`]: #restserver.express
