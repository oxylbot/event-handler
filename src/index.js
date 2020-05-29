const path = require("path");
const protobuf = require("protobufjs");

const BucketClient = require("./sockets/BucketClient");
const EventSocket = require("./sockets/EventSocket");

const bucketClient = new BucketClient();
const eventSocket = new EventSocket();

async function init() {
	const rpcProto = await protobuf.load(path.resolve(__dirname, "..", "bucket-proto", "rpcWrapper.proto"));
	const discordProto = await protobuf.load(path.resolve(__dirname, "..", "bucket-proto", "service.proto"));
	bucketClient.start({
		discord: discordProto,
		rpc: rpcProto
	});

	const eventProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "events.proto"));
	eventSocket.start(eventProto);
	eventSocket.on("message", message => {
		// TODO
	});
}

init();

process.on("SIGTERM", () => {
	bucketClient.close();
	eventSocket.close();

	process.exit(0);
});
