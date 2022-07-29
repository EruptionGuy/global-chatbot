const {Client, Collection, GatewayIntentBits, InteractionType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Database = require('easy-json-database')
const database = new Database("./global-db.json")

const keepAlive = require('./server.js');
const config = require('./config.js')

// Print errors in console
let process = require('process');
process.on('uncaughtException', function(err) {
  console.log(err);
});

// When the bot starts
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    status: "idle",
    activities: [{
      name: 'the world wide chat | /help',
      type: "WATCHING"
    }]
  });
})

// Slash commands
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const token = process.env.token;
client.commands = new Collection()
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const clientId = '940125226086330409';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
  client.commands.set(command.name, command)
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.on('interactionCreate', async interaction => {
	if (interaction.type !== InteractionType.ApplicationCommand) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Button events
client.on('interactionCreate', async (i) => {
        let member = i.guild.members.cache.get(i.member.user.id)
        let interaction = i;
        if (!(i.isButton())) return;
        if (((i.customId)) == 'setupYes') {
          const test = require("./commands/setup.js");
          const channelOverwrite2 = config.channelOverwrite
          console.log(channelOverwrite2);
          i.reply({
            content: String(`Succesfully overwrited the global chat channel! New channel id: \`${channelOverwrite2}\``),
            ephemeral: false,
          });
         database.set(`${i.guild.id}-global`, channelOverwrite2); 
        }
})

// Login and keepAlive()
module.exports = client
client.login(process.env.token);
keepAlive();