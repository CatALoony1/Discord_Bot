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

    /**
     * Fügt mehrere Objekte in einer einzigen Transaktion in die Datenbank ein.
     * @param {Array<Object>} objects - Eine Liste von Objekten, die eingefügt werden sollen.
     * @returns {Promise<number>} - Die Anzahl der eingefügten Zeilen.
     */
    async insertMany(objects) {
        if (!objects || objects.length === 0) {
            return 0;
        }

        const firstObj = objects[0];
        const fields = Object.keys(firstObj).filter(key => key !== 'id' && !key.endsWith('Obj'));
        const placeholders = fields.map(() => '?').join(', ');
        const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;

        return new Promise((resolve, reject) => {
            // Führe eine Transaktion aus, um die Performance zu verbessern
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION;");
                const stmt = this.db.prepare(sql);

                for (const obj of objects) {
                    const values = fields.map(key => obj[key]);
                    stmt.run(values, (err) => {
                        if (err) {
                            console.error(`Error inserting object into ${this.tableName}:`, err.message);
                            // Beim ersten Fehler die Transaktion zurückrollen und ablehnen
                            this.db.run("ROLLBACK;");
                            reject(err);
                        }
                    });
                }
                
                stmt.finalize();

                // Transaktion committen und die Anzahl der Änderungen zurückgeben
                this.db.run("COMMIT;", function(err) {
                    if (err) {
                        console.error(`Error committing transaction for ${this.tableName}:`, err.message);
                        reject(err);
                    } else {
                        resolve(objects.length);
                    }
                });
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

    /**
     * Aktualisiert mehrere Objekte in einer einzigen Transaktion in der Datenbank.
     * @param {Array<Object>} objects - Eine Liste von Objekten, die aktualisiert werden sollen.
     * @returns {Promise<number>} - Die Anzahl der aktualisierten Zeilen.
     */
    async updateMany(objects) {
        if (!objects || objects.length === 0) {
            return 0;
        }

        const firstObj = objects[0];
        const fields = Object.keys(firstObj).filter(key => key !== '_id' && !key.endsWith('Obj'));
        if (fields.length === 0) {
            return 0;
        }

        const setClauses = fields.map(key => `${key} = ?`).join(', ');
        const sql = `UPDATE ${this.tableName} SET ${setClauses} WHERE _id = ?`;

        return new Promise((resolve, reject) => {
            let totalChanges = 0;
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION;");
                const stmt = this.db.prepare(sql);

                for (const obj of objects) {
                    const values = fields.map(key => obj[key]);
                    values.push(obj._id);
                    stmt.run(values, function(err) {
                        if (err) {
                            console.error(`Error updating object in ${this.tableName}:`, err.message);
                            this.db.run("ROLLBACK;");
                            reject(err);
                        } else {
                            totalChanges += this.changes;
                        }
                    });
                }
                
                stmt.finalize();

                this.db.run("COMMIT;", (err) => {
                    if (err) {
                        console.error(`Error committing transaction for ${this.tableName}:`, err.message);
                        reject(err);
                    } else {
                        resolve(totalChanges);
                    }
                });
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

    /**
     * Löscht mehrere Objekte in einer einzigen Anweisung anhand ihrer IDs.
     * @param {Array<number|string>} ids - Ein Array von IDs der zu löschenden Objekte.
     * @returns {Promise<number>} - Die Anzahl der gelöschten Zeilen.
     */
    async deleteMany(ids) {
        if (!ids || ids.length === 0) {
            return 0;
        }

        const placeholders = ids.map(() => '?').join(', ');
        const sql = `DELETE FROM ${this.tableName} WHERE _id IN (${placeholders})`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, ids, function(err) {
                if (err) {
                    console.error(`Error deleting many from ${this.tableName}:`, err.message);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }
}

module.exports = BaseDAO;
