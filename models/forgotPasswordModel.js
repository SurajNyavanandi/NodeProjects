const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const ForgotPasswordRequest = sequelize.define('forgotPasswordRequest', {
    id: {
        type: Sequelize.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
});

module.exports = ForgotPasswordRequest;
