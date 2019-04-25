const fs = require("fs").promises;
const path = require("path");

const Command = require("./Command");

const commands = new Map();
const commandRegex = /(\w+)(?:\s+|$)(.+)?/i;

module.exports = async ctx => {
	console.log("parsing");
	const [, command, args] = commandRegex.exec(ctx.strippedContent) || [null, null, null];
	console.log("cmd", command);
	if(command === null) return;

	ctx.command = command;
	ctx.rawArgs = args;

	console.log(commands.has(ctx.command));
	if(commands.has(ctx.command)) commands.get(ctx.command).run(ctx);
};


const commandTypes = ["default"];
module.exports.registerCommands = async () => {
	commands.clear();

	for(const commandType of commandTypes) {
		const commandFolder = path.resolve(__dirname, commandType);

		for(const commandName of await fs.readdir(commandFolder, { encoding: "utf8" })) {
			const command = require(path.resolve(commandFolder, commandName));
			command.name = commandName;
			command.type = commandType;

			commands.set(commandName, new Command(command));
		}
	}

	console.log("updated commands", commands);
};
