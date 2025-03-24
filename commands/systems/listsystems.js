const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listsystems')
        .setDescription('List systems'),
    async execute(interaction) {
        const client = interaction.client
        const guild = interaction.guild

        // Check if executed from a guild
        if(!guild) {
            return interaction.reply({
                content: '❌ This command can only be executed inside a server. ❌',
                flags: MessageFlags.Ephemeral
            })
        }

        const systems = await client.db.System.findAll({
            where: { guildId: guild.id, active: true }
        });

        if (systems.length === 0) {
            return interaction.reply({
                content: '❗There are no systems registered for this server.❗',
                flags: MessageFlags.Ephemeral
            });
        }

        // Formatting response
        const systemList = systems.map(s => `• [${s.name}](https://evemaps.dotlan.net/system/${s.name})`).join('\n');

        await interaction.reply({
            content: `**List of Systems for this server:**\n${systemList}`,
            flags: MessageFlags.Ephemeral
        });
    }
}