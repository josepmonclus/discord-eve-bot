module.exports = (sequelize, DataTypes) => {
    const AnomalyMiningHistory = sequelize.define('AnomalyMiningHistory', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        anomalyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        minedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    })

    AnomalyMiningHistory.associate = (models) => {
        AnomalyMiningHistory.belongsTo(models.Anomaly, {
            foreignKey: 'anomalyId',
            as: 'anomaly',
            onDelete: 'CASCADE'
        });

        AnomalyMiningHistory.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE'
        });
    };

    return AnomalyMiningHistory;
}