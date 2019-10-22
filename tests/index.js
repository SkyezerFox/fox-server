const fox = require("../dist");

const server = new fox.Server();
server.on("debug", console.log);

server.start();
