const fs = require("fs").promises;
const path = require("path");

const Command = require("./Command");

const commands = new Map();
const commandRegex = /(\w+)(?:\s+|$)(.+)?/i;

module.exports = async ctx => {
	const [, command, args] = commandRegex.exec(ctx.strippedContent);

	ctx.command = command;
	ctx.rawArgs = args;

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
};
