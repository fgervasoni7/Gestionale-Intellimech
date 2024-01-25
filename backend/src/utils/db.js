import Sequelize from 'sequelize';
import Logger from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

// Database connection mysql

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
        define: {
        timestamps: false,
        },
    },
    );
/* Test connection */
sequelize.authenticate()
    .then(() => {
        Logger('success','Database connection has been established successfully');
        // return true when import this file in server.js
        return true;
    })
    .catch(err => {
        Logger('error','Unable to connect to the database:', err);
    });


export default sequelize;