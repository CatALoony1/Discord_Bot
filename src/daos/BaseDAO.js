// daos/BaseDAO.js
class BaseDAO {
    constructor(db, tableName) {
        if (!db) {
            throw new Error("Database instance must be provided to BaseDAO.");
        }
        this.db = db;
        this.tableName = tableName;
    }

    // Führt eine SQL-Abfrage aus und gibt das erste Ergebnis zurück
    async getById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName} WHERE _id = ?`;
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error(`Error fetching from ${this.tableName} by ID:`, err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Führt eine SQL-Abfrage aus und gibt alle Ergebnisse zurück
    async getAll() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${this.tableName}`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error(`Error fetching all from ${this.tableName}:`, err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Fügt ein neues Objekt in die Datenbank ein
    async insert(obj) {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(obj).filter(key => key !== 'id' && !key.endsWith('Obj')); // Filter out _id if auto-generated and foreign key objects
            const placeholders = fields.map(() => '?').join(', ');
            const values = fields.map(key => obj[key]);
            const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;

            this.db.run(sql, values, function(err) {
                if (err) {
                    console.error(`Error inserting into ${this.tableName}:`, err.message);
                    reject(err);
                } else {
                    resolve(this.lastID); // Returns the _id of the inserted row
                }
            });
        });
    }

    // Aktualisiert ein vorhandenes Objekt in der Datenbank
    async update(obj) {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(obj).filter(key => key !== '_id' && !key.endsWith('Obj')); // Exclude _id and FK objects from update fields
            if (fields.length === 0) {
                resolve(0); // Nothing to update
                return;
            }
            const setClauses = fields.map(key => `${key} = ?`).join(', ');
            const values = fields.map(key => obj[key]);
            values.push(obj._id); // Add _id for WHERE clause

            const sql = `UPDATE ${this.tableName} SET ${setClauses} WHERE _id = ?`;

            this.db.run(sql, values, function(err) {
                if (err) {
                    console.error(`Error updating ${this.tableName}:`, err.message);
                    reject(err);
                } else {
                    resolve(this.changes); // Returns number of rows changed
                }
            });
        });
    }

    // Löscht ein Objekt anhand seiner ID
    async delete(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM ${this.tableName} WHERE _id = ?`;
            this.db.run(sql, [id], function(err) {
                if (err) {
                    console.error(`Error deleting from ${this.tableName}:`, err.message);
                    reject(err);
                } else {
                    resolve(this.changes); // Returns number of rows deleted
                }
            });
        });
    }
}

module.exports = BaseDAO;