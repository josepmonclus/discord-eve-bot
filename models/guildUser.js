module.exports = (sequelize, DataTypes) => {
    const GuildUser = sequelize.define('GuildUser', {
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })

    GuildUser.associate = (models) => {
        GuildUser.belongsTo(models.Guild, { 
            foreignKey: 'guildId', 
            onDelete: 'CASCADE' 
        });
        GuildUser.belongsTo(models.User, { 
            foreignKey: 'userId', 
            onDelete: 'CASCADE' 
        });
    };

    return GuildUser
}