const { Invoice, Customer } = require('./models');

async function check() {
    try {
        const invoices = await Invoice.findAll({
            include: [{ model: Customer }]
        });
        console.log('Invoices Data with Include:', JSON.stringify(invoices, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
