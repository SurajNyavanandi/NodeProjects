const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Url = sequelize.define('url', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Url;
