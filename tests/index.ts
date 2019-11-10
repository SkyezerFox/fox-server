import { FoxServer } from "../src/";

const server = new FoxServer({ disableAnimations: false });

const testNamedFunction = () => new Promise((r) => setTimeout(r, 1e3));
const testNamedFunction2 = () => new Promise((r) => setTimeout(r, 0.5e3));
const testNamedFunction3 = () => new Promise((r) => setTimeout(r, 0.5e3));

server.task(testNamedFunction, testNamedFunction2, testNamedFunction3);

server.start();
