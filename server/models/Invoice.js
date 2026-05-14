const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Invoice = sequelize.define('Invoice', {
    type: { type: DataTypes.STRING, defaultValue: 'Invoice' },
    invoiceNumber: { type: DataTypes.STRING, allowNull: false },
    prefix: { type: DataTypes.STRING },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    dueDate: { type: DataTypes.DATEONLY },
    reference: { type: DataTypes.STRING },
    placeOfSupply: { type: DataTypes.STRING },
    customerId: { type: DataTypes.INTEGER },
    items: { type: DataTypes.JSON },
    subTotal: { type: DataTypes.FLOAT },
    taxAmount: { type: DataTypes.FLOAT },
    totalAmount: { type: DataTypes.FLOAT },
    amountPaid: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: { type: DataTypes.STRING, defaultValue: 'Unpaid' },
    notes: { type: DataTypes.TEXT },
    terms: { type: DataTypes.TEXT },
    totalAmountInWords: { type: DataTypes.TEXT },
    bankDetails: { type: DataTypes.JSON },
    signature: { type: DataTypes.TEXT }
});

module.exports = Invoice;
