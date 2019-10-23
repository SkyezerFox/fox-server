import { FoxServer } from "../dist/";

const server = new FoxServer();

server.task(() => new Promise((r) => setTimeout(r, 1e3)));

server.start();
