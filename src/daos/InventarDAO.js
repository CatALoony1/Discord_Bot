// daos/InventarDAO.js
const BaseDAO = require('./BaseDAO');
const Inventar = require('../sqliteModels/Inventar');
const GameUser = require('../sqliteModels/GameUser');
const { itemsDAO } = require('../utils/initializeDB.js');

class InventarDAO extends BaseDAO {

    constructor(db) {
        super(db, 'inventare');
    }

    _mapRowToModel(row) {
        if (!row) return null;
        return new Inventar(row._id, row.besitzer, JSON.parse(row.items || '[]'))
    }

    _mapJoinedRowToModel(row) {
        if (!row) return null;

        const inventar = new Inventar(
            row._id,
            row.besitzer,
            // Sicherstellen, dass JSON.parse immer einen gültigen String erhält
            // Wenn row.items NULL ist, wird es zu '[]' für ein leeres Array geparst.
            JSON.parse(row.items || '[]')
        );

        if (row.besitzer_user_id) {
            inventar.besitzerObj = new GameUser(
                row.besitzer_user_id,
                row.besitzer_user_userId,
                row.besitzer_user_guildId,
                row.besitzer_user_quizadded,
                row.besitzer_user_daily,
                row.besitzer_user_weight
            );
        }
        return inventar;
    }

    async _populateItems(inventar) {
        if (!inventar || !inventar.items || inventar.items.length === 0) {
            return inventar;
        }

        const populatedItems = [];
        for (const itemEntry of inventar.items) {
            const itemId = itemEntry.itemId || itemEntry.item;
            if (itemId && itemsDAO) { // Prüfen, ob itemsDAO gesetzt ist
                const fullItem = await itemsDAO.getById(itemId);
                if (fullItem) {
                    populatedItems.push({
                        itemId: itemId,
                        quantity: itemEntry.quantity,
                        itemObj: fullItem
                    });
                } else {
                    console.warn(`Item with ID ${itemId} not found for inventory ${inventar._id}. Keeping original reference.`);
                    // Wenn Item nicht gefunden, behalten Sie den ursprünglichen Eintrag bei
                    populatedItems.push(itemEntry);
                }
            } else {
                console.warn(`Invalid item entry or itemsDAO not set in inventory ${inventar._id}:`, itemEntry);
                populatedItems.push(itemEntry); // Originalen Eintrag beibehalten
            }
        }
        inventar.items = populatedItems;
        return inventar;
    }

    async getById(id) {
        const sql = `
            SELECT
                i._id, i.besitzer, i.items,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight
            FROM inventare i
            LEFT JOIN game_users gu ON i.besitzer = gu._id
            WHERE i._id = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], async (err, row) => {
                if (err) {
                    console.error('Error fetching inventar by ID with JOIN:', err.message);
                    reject(err);
                } else {
                    const inventar = this._mapJoinedRowToModel(row);
                    if (inventar) {
                        await this._populateItems(inventar);
                    }
                    resolve(inventar);
                }
            });
        });
    }

    async getAll() {
        const sql = `
            SELECT
                i._id, i.besitzer, i.items,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight
            FROM inventare i
            LEFT JOIN game_users gu ON i.besitzer = gu._id;
        `;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], async (err, rows) => {
                if (err) {
                    console.error('Error fetching all inventare with JOIN:', err.message);
                    reject(err);
                } else {
                    const inventare = rows.map(this._mapJoinedRowToModel);
                    for (const inventar of inventare) {
                        await this._populateItems(inventar);
                    }
                    resolve(inventare);
                }
            });
        });
    }

    async insert(inventar) {
        // Sicherstellen, dass inventar.items ein Array ist, auch wenn null/undefined
        const itemsToProcess = Array.isArray(inventar.items) ? inventar.items : [];

        // Beim Speichern nur die itemId und quantity speichern, nicht das ganze Item-Objekt
        const itemsToStore = itemsToProcess.map(entry => ({
            itemId: entry.itemObj ? entry.itemObj._id : entry.itemId,
            quantity: entry.quantity
        }));

        const dataToSave = {
            _id: inventar._id,
            besitzer: inventar.besitzer,
            items: JSON.stringify(itemsToStore) // JSON.stringify das Array von { itemId, quantity }
        };
        return await super.insert(dataToSave);
    }

    /**
     * Fügt mehrere Inventar-Objekte ein.
     * Serialisiert die `items` und ruft dann super.insertMany auf.
     * @param {Array<Inventar>} inventare - Eine Liste von Inventar-Objekten.
     * @returns {Promise<number>} - Die Anzahl der eingefügten Zeilen.
     */
    async insertMany(inventare) {
        const dataToSave = inventare.map(inv => {
            const itemsToProcess = Array.isArray(inv.items) ? inv.items : [];
            const itemsToStore = itemsToProcess.map(entry => ({
                itemId: entry.itemObj ? entry.itemObj._id : entry.itemId,
                quantity: entry.quantity
            }));
            return {
                _id: inv._id,
                besitzer: inv.besitzer,
                items: JSON.stringify(itemsToStore)
            };
        });
        return await super.insertMany(dataToSave);
    }

    async update(inventar) {
        // Sicherstellen, dass inventar.items ein Array ist, auch wenn null/undefined
        const itemsToProcess = Array.isArray(inventar.items) ? inventar.items : [];

        // Beim Speichern nur die itemId und quantity speichern, nicht das ganze Item-Objekt
        const itemsToStore = itemsToProcess.map(entry => ({
            itemId: entry.itemObj ? entry.itemObj._id : entry.itemId,
            quantity: entry.quantity
        }));

        const dataToSave = {
            _id: inventar._id,
            besitzer: inventar.besitzer,
            items: JSON.stringify(itemsToStore)
        };
        return await super.update(dataToSave);
    }

    /**
     * Aktualisiert mehrere Inventar-Objekte.
     * Serialisiert die `items` und ruft dann super.updateMany auf.
     * @param {Array<Inventar>} inventare - Eine Liste von Inventar-Objekten.
     * @returns {Promise<number>} - Die Anzahl der aktualisierten Zeilen.
     */
    async updateMany(inventare) {
        const dataToSave = inventare.map(inv => {
            const itemsToProcess = Array.isArray(inv.items) ? inv.items : [];
            const itemsToStore = itemsToProcess.map(entry => ({
                itemId: entry.itemObj ? entry.itemObj._id : entry.itemId,
                quantity: entry.quantity
            }));
            return {
                _id: inv._id,
                besitzer: inv.besitzer,
                items: JSON.stringify(itemsToStore)
            };
        });
        return await super.updateMany(dataToSave);
    }

    async getOneByUserAndGuild(userId, guildId) {
        const sql = `
            SELECT
                i._id, i.besitzer, i.items,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight
            FROM inventare i
            LEFT JOIN game_users gu ON i.besitzer = gu._id
            WHERE gu.userId = ? AND gu.guildId = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [userId, guildId], async (err, row) => {
                if (err) {
                    console.error('Error fetching inventar by ID with JOIN:', err.message);
                    reject(err);
                } else {
                    const inventar = this._mapJoinedRowToModel(row);
                    if (inventar) {
                        await this._populateItems(inventar);
                    }
                    resolve(inventar);
                }
            });
        });
    }

    /**
     * Gibt das Inventar zu einem Besitzer zurück, jedoch ohne das Besitzer-Objekt.
     *
     * @param {String} besitzerId
     * @returns
     */
    async getOneByBesitzer(besitzerId) {
        const sql = `
            SELECT
                i._id, i.besitzer, i.items,
                gu._id AS besitzer_user_id,
                gu.userId AS besitzer_user_userId,
                gu.guildId AS besitzer_user_guildId,
                gu.quizadded AS besitzer_user_quizadded,
                gu.daily AS besitzer_user_daily,
                gu.weight AS besitzer_user_weight
            FROM inventare i
            LEFT JOIN game_users gu ON i.besitzer = gu._id
            WHERE i.besitzer = ?;
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [besitzerId], async (err, row) => {
                if (err) {
                    console.error('Error fetching inventar by ID with JOIN:', err.message);
                    reject(err);
                } else {
                    const inventar = this._mapRowToModel(row);
                    if (inventar) {
                        await this._populateItems(inventar);
                    }
                    resolve(inventar);
                }
            });
        });
    }
}
module.exports = InventarDAO;
