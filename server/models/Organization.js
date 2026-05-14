const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Organization = sequelize.define('Organization', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    joinCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = Organization;
