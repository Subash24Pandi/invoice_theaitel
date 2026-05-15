console.log('INITIALIZING MODELS AND ASSOCIATIONS...');
const User = require('./User');
const Customer = require('./Customer');
const Product = require('./Product');
const Invoice = require('./Invoice');

// Associations
Invoice.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(Invoice, { foreignKey: 'customerId' });
Invoice.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Invoice, { foreignKey: 'userId' });

module.exports = {
    User,
    Customer,
    Product,
    Invoice
};
