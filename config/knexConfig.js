const databaseUrl = process.env.DATABASE_URL;
const parseConnectionString = require("pg-connection-string").parse;

const postgresConfig = parseConnectionString(databaseUrl)
postgresConfig.ssl = { rejectUnauthorized: false };

module.exports = {
    development: {
        client: 'pg',
        connection: {
            connectionString: databaseUrl
        }

    },
    production: {
        client: "pg",
        connection: postgresConfig,
    }
}