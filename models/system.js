module.exports = (sequelize, DataTypes) => {
    const System = sequelize.define('System', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        guildId: {
            type: DataTypes.STRING,
            allowNull: false
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

    System.associate = (models) => {
        System.belongsTo(models.Guild, {
            foreignKey: 'guildId',
            as: 'guild',
            onDelete: 'CASCADE'
        })

        System.hasMany(models.Anomaly, {
            foreignKey: 'systemId',
            as: 'anomalies',
            onDelete: 'CASCADE'
        })
    }

    return System
}