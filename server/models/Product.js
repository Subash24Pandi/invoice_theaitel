const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, defaultValue: 'Product' },
    description: { type: DataTypes.TEXT },
    sellingPrice: { type: DataTypes.FLOAT },
    purchasePrice: { type: DataTypes.FLOAT },
    taxRate: { type: DataTypes.FLOAT },
    unit: { type: DataTypes.STRING },
    hsn: { type: DataTypes.STRING },
    openingQty: { type: DataTypes.FLOAT },
    openingValue: { type: DataTypes.FLOAT },
    lowStockLimit: { type: DataTypes.FLOAT }
});

module.exports = Product;
