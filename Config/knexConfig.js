const databaseUrl = process.env.DATABASE_URL;

module.exports = {
    development: {
        client: 'pg',
        connection: {
            connectionString: databaseUrl,
        },
    },
    production: {
        client: 'pg',
        connection: {
            connectionString: databaseUrl,
            ssl: false
        },
    }
}