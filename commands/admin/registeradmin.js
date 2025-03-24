const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const isAdminOrSuperAdmin = require('../../helpers/isAdminOrSuperadmin');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('registeradmin')
		.setDescription('Register user as Admin.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you want to register as admin')
                .setRequired(true)
        ),
    async execute(interaction) {
        const client = interaction.client
        const guildId = interaction.guild
        const targetUser = interaction.options.getUser('user')

        // Check if executed from a guild
        if(!guildId) {
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

        try {
            const [guild] = await client.db.Guild.findOrCreate({ 
                where: { id: guildId },
                defaults: { name: interaction.guild.name }
            })
            const [user] = await client.db.User.findOrCreate({ 
                where: { id: targetUser.id },
                defaults: { username: targetUser.username }
            })

            await client.db.GuildUser.upsert({
                userId: user.id,
                guildId: guild.id,
                isAdmin: true
            })

            return interaction.reply({ 
                content: `✅ <@${targetUser.id}> has been registered as an admin for this server. ✅`,
                flags: MessageFlags.Ephemeral
            })
        } catch(error) {
            console.error(error)
            return interaction.reply({ 
                content: '❌ An error occurred while trying to register the user. ❌',
                flags: MessageFlags.Ephemeral
            })
        }
    }
}