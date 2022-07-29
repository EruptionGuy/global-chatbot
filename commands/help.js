const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Support has arrived!'),
	async execute(interaction) {
		await interaction.reply('Test!');
  },
}