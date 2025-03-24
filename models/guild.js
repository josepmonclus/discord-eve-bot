module.exports = (sequelize, DataTypes) => {
    const Guild = sequelize.define('Guild', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    })

    Guild.associate = (models) => {
        Guild.belongsToMany(models.User, {
            through: models.GuildUser,
            foreignKey: 'guildId',
            as: 'members',
            onDelete: 'CASCADE'
        })

        Guild.hasMany(models.System, {
            foreignKey: 'guildId',
            as: 'systems',
            onDelete: 'CASCADE'
        })
    }

    return Guild
}