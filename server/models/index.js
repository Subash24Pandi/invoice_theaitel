console.log('INITIALIZING MODELS AND ASSOCIATIONS...');
const User = require('./User');
const Customer = require('./Customer');
const Product = require('./Product');
const Invoice = require('./Invoice');

// Associations
Invoice.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(Invoice, { foreignKey: 'customerId' });

module.exports = {
    User,
    Customer,
    Product,
    Invoice
};
