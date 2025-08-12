// 02_database.js
const path = require('path');
const { initializeDatabase } = require('../../events/ready/02_database'); // Ihre initializeDB.js


const DB_PATH = path.join(__dirname, '..', '..', '..', 'bot_database.db');

module.exports = async () => {
    let database;

    try {
        database = await initializeDatabase(DB_PATH);
        console.log('Database and all tables are ready!');

        const closeDb = () => {
            if (database) {
                console.log('Closing database connection...');
                database.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                    process.exit(0);
                });
            } else {
                console.log('Database connection not established or already closed. Exiting.');
                process.exit(0);
            }
        };
        process.on('SIGINT', closeDb);
        process.on('SIGTERM', closeDb);
        process.on('SIGUSR2', closeDb);

    } catch (error) {
        console.error('Failed to initialize database on bot startup:', error);
        process.exit(1);
    }
};