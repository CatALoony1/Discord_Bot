require('dotenv').config();
const Tiere = require('../sqliteModels/Tiere');
const fs = require('fs').promises;
const path = require('path');
const { tiereDAO } = require('../events/ready/02_database');

const animalFoler = './animals';

function getTierart(filename) {
    const basename = path.basename(filename, '.webp');
    let tierart = basename.replace(/\d+$/, '');
    if (tierart.includes('-')) {
        tierart = tierart.split('-')[0];
    }
    return tierart;
}

async function jobFunction(client) {
    let localAnimals = [];
    try {
        const allLocalFiles = await fs.readdir(animalFoler);
        localAnimals = allLocalFiles.filter(file => path.extname(file).toLowerCase() === '.webp');
        console.log(`Gefundene Tierbilder: ${localAnimals.length}`);
        const existingPfade = await tiereDAO.getAllPfade();
        const newTiereToAdd = [];
        for (const filename of localAnimals) {
            const filenameWithoutExtension = path.basename(filename, '.webp');
            if (!existingPfade.has(filenameWithoutExtension)) {
                const tierart = getTierart(filename);
                let customName = filenameWithoutExtension;
                if (filenameWithoutExtension.includes('-')) {
                    customName = filenameWithoutExtension.split('-')[1];
                }
                const newTier = new Tiere();
                newTier.setPfad(filenameWithoutExtension);
                newTier.setTierart(tierart);
                newTier.setCustomName(customName);
                newTiereToAdd.push(newTier);
            }
        }
        if (newTiereToAdd.length > 0) {
            console.log(`Neue Tierbilder zum Hinzufügen: ${newTiereToAdd.length}`);
            const result = await tiereDAO.insertMany(newTiereToAdd);
            console.log(`Erfolgreich hinzugefügt: ${result} neue Tierbilder.`);
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