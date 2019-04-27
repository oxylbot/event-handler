const commandParser = require("./commands/commandParser");
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
	commandSocket.on("message", message => {
		const ctx = {
			strippedContent: message.command,
			bucket: bucketClient,
			channelID: message.channelId,
			messageID: message.id,
			authorID: message.authorId,
			guildID: message.guildId
		};

		commandParser(ctx);
	});

	commandParser.registerCommands();
}

init();

process.on("SIGTERM", () => {
	bucketClient.close();
	commandSocket.close();

	process.exit(0);
});
