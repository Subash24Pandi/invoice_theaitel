const { Invoice } = require('./models');
const { sequelize } = require('./config/db');

async function check() {
    try {
        const invoices = await Invoice.findAll();
        console.log('Invoices Data:', JSON.stringify(invoices, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
