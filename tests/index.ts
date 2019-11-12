import chai from "chai";
import chaiHttp from "chai-http";

import { FoxServer } from "../src/";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Server Instantiation", () => {
	it("should return a valid server object", () => {
		let server = new FoxServer({ disableAnimations: true });
		return expect(server).to.be.instanceOf(FoxServer);
	});

	it("should properly register tasks", () => {
		let server = new FoxServer({ disableAnimations: true });

		function namedFunction() {
			return new Promise((r) => setTimeout(r, 0.2e3));
		}
		const arrowFunction = () => null;

		expect(server.beforeStartTasks).to.be.length(0);
		expect(server.afterStartTasks).to.be.length(0);

		server
			.before(namedFunction, arrowFunction)
			.after(namedFunction, arrowFunction);

		expect(server.beforeStartTasks).to.be.length(2);
		expect(server.afterStartTasks).to.be.length(2);
	});

	it("should correctly call tasks", async () => {
		let server = new FoxServer({ disableAnimations: true });

		let beforeTask = false;
		let afterTask = true;

		server.before(() => (beforeTask = true));
		server.before(() => (afterTask = true));

		await server.start();

		console.log("boop");

		expect(beforeTask).to.equal(true);
		expect(afterTask).to.equal(true);

		await server.stop();

		return true;
	});
});

describe("HTTP server", () => {
	it("should interface directly with express", () => {
		let server = new FoxServer({ disableAnimations: true });
		expect(server.rest.use).to.not.equal(undefined);
	});

	it("should listen on the specified port", (done) => {
		const port = 5432;

		let server = new FoxServer({ port, disableAnimations: true });
		server.rest.use("/", (req, res) => res.json({ msg: "uwu" }));

		server
			.start()
			.then(() => chai.request("http://localhost:" + port).get("/"))
			.then((res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property("msg", "uwu");

				server.stop();
				done();
			});
	});

	it("should define routes properly", (done) => {
		let server = new FoxServer({ disableAnimations: true });

		server.rest.express.get("/:id", (req, res) =>
			res.json({ id: Number(req.params.id) + 1 })
		);

		const randInt = Math.floor(Math.random() * 100);

		server
			.start()
			.then(() =>
				chai.request("http://localhost:8080").get(`/${randInt}`)
			)
			.then((req) => {
				expect(req.body).to.have.property("id", randInt + 1);

				server.stop();
				done();
			});
	});
});
