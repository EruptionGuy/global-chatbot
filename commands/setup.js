const {Client, GatewayIntentBits, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');
const Database = require('easy-json-database')
const database = new Database("./global-db.json")
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const config = require("../config.js")

module.exports = {
  name: 'setup',
  data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Setup your global chat.')
    .addChannelOption(option => option.setName('channel').setDescription('Select the global chat channel').setRequired(true)),
	async execute(interaction) {
    if (!database.has(`${interaction.guild.id}-global`, interaction.options.getChannel('channel').id)) {
     await interaction.reply(`Setup is done, your channel id is \`${interaction.options.getChannel('channel').id}\`. Use this to connect to other servers!`);
    database.set(`${interaction.guild.id}-global`, interaction.options.getChannel('channel').id); 
    } else {
     const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('setupYes')
					.setLabel('Yes')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('setupNo')
					.setLabel('No')
					.setStyle(ButtonStyle.Danger),
			);

    const channelOverwrite = interaction.options.getChannel('channel').id;

    config.channelOverwrite = channelOverwrite
      
    await interaction.reply({content: 'You\'ve already set the global chat channel, do you want to set up again?', ephemeral: false, components: [row]}) 
    }

    interaction.guild.channels.create({
    	name: 'global-chat-logs',
    	type: ChannelType.GuildText,
    })
  },
}