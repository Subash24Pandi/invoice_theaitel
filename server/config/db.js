const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {}
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL Connected Successfully (theaitel)');
        
        // Sync models
        await sequelize.sync({ alter: true }); 
        console.log('All models were synchronized successfully.');

        // Seed Default User if not exists
        const User = require('../models/User');
        const Product = require('../models/Product');
        const bcrypt = require('bcryptjs');
        const adminExists = await User.findOne({ where: { email: 'admin@vortex.com' } });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        if (!adminExists) {
            await User.create({
                companyName: 'Vortex Enterprise',
                ownerName: 'Admin User',
                email: 'admin@vortex.com',
                phone: '9876543210',
                password: hashedPassword
            });
            console.log('Default admin user seeded successfully.');
        } else {
            // Force reset password for admin to be sure
            await adminExists.update({ password: hashedPassword });
            console.log('Default admin password synchronized.');
        }

        // Seed Constant Product: AI_Telecalling
        const aiProduct = await Product.findOne({ where: { name: 'AI_Telecalling' } });
        if (!aiProduct) {
            await Product.create({
                name: 'AI_Telecalling',
                type: 'Service',
                sellingPrice: 8.0,
                taxRate: 18,
                unit: 'NOS',
                description: 'Advanced AI-powered telecalling service'
            });
            console.log('Constant product AI_Telecalling seeded successfully.');
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
