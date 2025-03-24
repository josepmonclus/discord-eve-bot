module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isSuperAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })

    User.associate = (models) => {
        User.belongsToMany(models.Guild, {
            through: models.GuildUser,
            foreignKey: 'userId',
            as: 'guilds',
            onDelete: 'CASCADE'
        })
    }

    return User
}