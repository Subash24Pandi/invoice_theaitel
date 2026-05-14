const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Signature = sequelize.define('Signature', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.TEXT }, // Base64
    invert: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

module.exports = Signature;
