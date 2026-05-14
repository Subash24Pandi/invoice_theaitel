const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Bank = sequelize.define('Bank', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bankName: { type: DataTypes.STRING, allowNull: false },
    accountHolder: { type: DataTypes.STRING },
    accountNo: { type: DataTypes.STRING },
    ifscCode: { type: DataTypes.STRING },
    branchName: { type: DataTypes.STRING },
    upiId: { type: DataTypes.STRING },
}, { timestamps: true });

module.exports = Bank;
