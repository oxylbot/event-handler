class Command {
	constructor(command) {
		if(!command.name) throw new Error("Command has no name");
		else if(!command.run) throw new Error(`Command ${command.name} must have a run function`);
		else if(!command.description) console.warn(`Command ${command.name} has no description`);

		this.name = command.name;
		this.type = command.type;
		this.description = command.description;

		this.aliases = command.aliases || [];
		this.args = command.args || [];
		this.guildOnly = !!command.guildOnly;

		this.runFunction = command.run;
	}

	async run(ctx) {
		await this.runFunction(ctx);
	}
}

module.exports = Command;
