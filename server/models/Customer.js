const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Customer = sequelize.define('Customer', {
    name: { type: DataTypes.STRING, allowNull: false },
    companyName: { type: DataTypes.STRING },
    gstin: { type: DataTypes.STRING },
    gstType: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    placeOfSupply: { type: DataTypes.STRING },
    billingAddress: { type: DataTypes.TEXT },
    shippingAddress: { type: DataTypes.TEXT },
    openingBalance: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = Customer;
