const fox = require("../dist");

const server = new fox.FoxServer();

server.task(() => new Promise((r) => setTimeout(r, 1e3)));

server.start();
