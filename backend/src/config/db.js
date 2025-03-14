const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

let sequelize = null;

const createDatabase = async () => {
    const connection = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD
    });

    const [rows] = await connection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
        [DB_NAME]
    );

    if (rows.length === 0) {
        await connection.query(`CREATE DATABASE \`${DB_NAME}\`;`);
        console.log(`✅ Database "${DB_NAME}" created.`);
    } else {
        console.log(`📂 Database "${DB_NAME}" already exists.`);
    }

    await connection.end();
};

const initializeSequelize = async () => {
    if (sequelize) {
        console.log("⚠️ Sequelize already initialized. Returning existing instance.");
        return sequelize;
    }

    await createDatabase();

    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: DB_DIALECT,
        logging: false
    });

    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    return sequelize;
};

const getSequelizeInstance = () => {
    if (!sequelize) {
        throw new Error('Sequelize has not been initialized. Call initializeSequelize() first.');
    }
    return sequelize;
};

module.exports = { initializeSequelize, getSequelizeInstance };