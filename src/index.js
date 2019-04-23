const path = require("path");
const protobuf = require("protobufjs");

const BucketClient = require("./sockets/BucketClient");
const CommandSocket = require("./sockets/CommandSocket");

const bucketClient = new BucketClient();
const commandSocket = new CommandSocket();

async function init() {
	const rpcProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "rpcWrapper.proto"));
	const discordProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "discordapi", "service.proto"));
	bucketClient.start({
		discord: discordProto,
		rpc: rpcProto
	});

	const commandProto = await protobuf.load(path.resolve(__dirname, "..", "protobuf", "Command.proto"));
	commandSocket.start(commandProto);
	commandSocket.on("message", async message => {
		console.log(message);
		if(message.command === "ping") {
			const msg = await bucketClient.request("createChannelMessage", {
				channelId: message.channelId,
				content: `PONG! Hello, ${message.authorId} in ${message.guildId}`
			});

			console.log(msg);
		}
	});
}

init();

process.on("SIGTERM", () => {
	bucketClient.close();
	commandSocket.close();

	process.exit(0);
});
