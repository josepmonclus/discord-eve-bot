module.exports = async function isAdminOrSuperAdmin(interaction) {
    const { client, user, guild } = interaction

    // Check if isSuperAdmin
    const dbUser = await client.db.User.findByPk(user.id);
    if (dbUser?.isSuperAdmin) {
        return true;
    }

    // Just can be Admin if command is executed in a server
    if(!guild) return false;

    const guildUser = await client.db.GuildUser.findOne({
        where: { userId: user.id, guildId: guild.id, isAdmin: true }
    })

    return !!guildUser
}