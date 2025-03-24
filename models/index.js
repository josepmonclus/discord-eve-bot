const { Sequelize, DataTypes } = require('sequelize')
const fs = require('fs')
const path = require('path')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false
})

const db = {}

fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js' && file.endsWith('.js'))
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes)
        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if(db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db