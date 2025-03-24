const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const isAdminOrSuperAdmin = require('../../helpers/isAdminOrSuperadmin');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addsystem')
        .setDescription('Add system to this server')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('System name')
                .setRequired(true)
        ),
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

        // Check if user is superadmin or guild admin
        const authorized = await isAdminOrSuperAdmin(interaction);
        if (!authorized) {
            return interaction.reply({
                content: '❌ You are not authorized to use this command. ❌',
                flags: MessageFlags.Ephemeral
            });
        }

        const name = interaction.options.getString('name');

        // Check if system already exists
        const [system, created] = await client.db.System.findOrCreate({
            where: { name, guildId: guild.id },
            defaults: {
                guildId: guild.id,
                name
            }
        });

        if (!created) {
            return interaction.reply({
                content: `❗System "${system.name}" already exists in this server.❗`,
                flags: MessageFlags.Ephemeral
            });
        }

        return interaction.reply({
            content: `✅ System "${system.name}" has been successfully added. ✅`,
            flags: MessageFlags.Ephemeral
        });
    }
}