require('dotenv').config();
const Tiere = require('../models/Tiere');
const fs = require('fs').promises;
const path = require('path');
const Items = require('../models/Items');

const animalFoler = './animals';

function getTierart(filename) {
    const basename = path.basename(filename, '.webp');
    const tierart = basename.replace(/\d+$/, '');
    return tierart;
}

async function jobFunction(client) {
    let localAnimals = [];
    const item = new Items({
        name: 'Tier',
        beschreibung: 'Kaufe ein Tier.',
        preis: 10000,
        boostOnly: false,
    });
    item.save();
    try {
        const allLocalFiles = await fs.readdir(animalFoler);
        localAnimals = allLocalFiles.filter(file => path.extname(file).toLowerCase() === '.webp');
        console.log(`Gefundene Tierbilder: ${localAnimals.length}`);
        const existingTierDokumente = await Tiere.find({}, 'pfad -_id').lean();
        const existingPfade = new Set(existingTierDokumente.map(doc => doc.pfad));
        const newTiereToAdd = [];
        for (const filename of localAnimals) {
            const filenameWithoutExtension = path.basename(filename, '.webp');
            if (!existingPfade.has(filenameWithoutExtension)) {
                const tierart = getTierart(filename);
                const newTier = {
                    pfad: filenameWithoutExtension,
                    tierart: tierart,
                };
                newTiereToAdd.push(newTier);
            }
        }
        if (newTiereToAdd.length > 0) {
            console.log(`Neue Tierbilder zum Hinzufügen: ${newTiereToAdd.length}`);
            const result = await Tiere.insertMany(newTiereToAdd, { ordered: false });
            console.log(`Erfolgreich hinzugefügt: ${result.length} neue Tierbilder.`);
        } else {
            console.log('Keine neuen Tierbilder zum Hinzufügen.');
        }
    } catch (error) {
        console.log(error);
        return;
    }
}

module.exports = {
    jobFunction
};