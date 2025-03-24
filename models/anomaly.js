module.exports = (sequelize, DataTypes) => {
    const Anomaly = sequelize.define('Anomaly', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }, 
        systemId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        type: {
            type: DataTypes.ENUM('Ice', 'Ore T1', 'Ore T2', 'Ore T3'),
            allowNull: false
        }, 
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        regenHours: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    })

    Anomaly.associate = (models) => {
        Anomaly.belongsTo(models.System, {
            foreignKey: 'systemId',
            as: 'system',
            onDelete: 'CASCADE'
        })
    }

    return Anomaly
}