const GameUser = require('../sqliteModels/GameUser.js');
const Bankkonten = require('../sqliteModels/Bankkonten.js');
const Inventar = require('../sqliteModels/Inventar.js');
require('../sqliteModels/Gluecksrad.js');
const { getDaos } = require('./daos.js');

async function removeMoney(member, money) {
    try {
        const { gameUserDAO, bankkontenDAO, inventarDAO, gluecksradDAO } = getDaos();
        const bankkonto = await bankkontenDAO.getOneByUserAndGuild(member.user.id, member.guild.if);
        if (bankkonto) {
            console.log(`user ${member.user.tag} received ${money} Geld`);
            bankkonto.currentMoney -= money;
            bankkonto.moneyLost += money;
            await bankkontenDAO.update(bankkonto);
        } else {
            console.log(`user ${member.user.tag} received ${money} Geld`);
            console.log(`new user ${member.user.tag} added to database`);
            const newUser = new GameUser();
            newUser.setUserId(member.user.id);
            newUser.setGuildId(member.guild.id);
            const newUserId = await gameUserDAO.insert(newUser);
            const newBankkonto = new Bankkonten();
            newBankkonto.setBesitzer(newUserId);
            newBankkonto.setCurrentMoney(money * -1);
            newBankkonto.setMoneyLost(money);
            await bankkontenDAO.insert(newBankkonto);
            const newInventar = new Inventar();
            newInventar.setBesitzer(newUserId);
            await inventarDAO.insert(newInventar);
        }
        const gluecksrad = await gluecksradDAO.getOneByGuild(member.guild.id);
        if (gluecksrad) {
            gluecksrad.sonderpool += Math.floor(money / 10);
            await gluecksradDAO.update(gluecksrad);
        }
        return money;
    } catch (error) {
        console.log(error);
    }
}

module.exports = removeMoney;