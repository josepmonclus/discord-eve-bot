const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const isAdminOrSuperAdmin = require('../../helpers/isAdminOrSuperadmin');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletesystem')
        .setDescription('Delete system to this server')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('System name')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async execute(interaction) {
        const client = interaction.client
        const guild = interaction.guild
        const systemName = interaction.options.getString('name');

        // Check if executed from a guild
        if(!guild) {
            return interaction.reply({
                content: '❌ This command can only be executed inside a server. ❌',
                flags: MessageFlags.Ephemeral
            })
        }

        // Check if user is superadmin or guild admin
        const authorized = await isAdminOrSuperAdmin(interaction);
        if (!authorized) {
            return interaction.reply({
                content: '❌ You are not authorized to use this command. ❌ ',
                flags: MessageFlags.Ephemeral
            });
        }

        // Find system
        const system = await client.db.System.findOne({
            where: { name: systemName, guildId: guild.id, active: true }
        });

        if (!system) {
            return interaction.reply({
                content: `❗No system named **${systemName}** found in this server.❗`,
                flags: MessageFlags.Ephemeral
            });
        }

        // Set system as inactive
        system.active = false;
        await system.save();

        await interaction.reply({
            content: `✅ System **${systemName}** has been deactivated successfully. ✅`,
            flags: MessageFlags.Ephemeral
        });
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const guildId = interaction.guildId;
        const systems = await interaction.client.db.System.findAll({
            where: { guildId, active: true },
            limit: 25 // Discord limit is 25 options
        });

        const filtered = systems
            .filter(system => system.name.toLowerCase().includes(focusedValue.toLowerCase()))
            .map(system => ({
                name: system.name,
                value: system.name
            }));

        await interaction.respond(filtered);
    }
}