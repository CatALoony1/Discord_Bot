const GameUser = require('../sqliteModels/GameUser.js');
const Bankkonten = require('../sqliteModels/Bankkonten.js');
const Inventar = require('../sqliteModels/Inventar.js');
const { getDaos } = require('./daos.js');

async function giveMoney(member, money, quizadded = false, daily = false) {
    try {
        const { gameUserDAO, bankkontenDAO, inventarDAO } =  getDaos();
        const bankkonto = await bankkontenDAO.getOneByUserAndGuild(member.user.id, member.guild.id);
        if (bankkonto) {
            const user = bankkonto.besitzerObj;
            if (quizadded) {
                if (user.quizadded > 0 && user.quizadded <= 10) {
                    money = (money + (user.quizadded * 100));
                } else if (user.quizadded > 10 && user.quizadded <= 30) {
                    money = (money + (user.quizadded * 50));
                } else if (user.quizadded > 30 && user.quizadded <= 100) {
                    money = (money + (user.quizadded * 20));
                } else if (user.quizadded > 100) {
                    money = (money + (user.quizadded * 10));
                }
            }
            if (member.roles.cache.some(role => role.name === 'Bumper')) {
                money = Math.ceil(money * 1.15);
            }
            if (member.roles.cache.some(role => role.name === 'Server Booster')) {
                money = Math.ceil(money * 1.15);
            }
            if (daily) {
                user.daily = new Date();
            }
            if (quizadded) {
                user.quizadded += 1;
            }
            console.log(`user ${member.user.tag} received ${money} Geld`);
            bankkonto.currentMoney += money;
            bankkonto.moneyGain += money;
            await bankkontenDAO.update(bankkonto);
            if (quizadded || daily) {
                await gameUserDAO.update(user);
            }
        } else {
            console.log(`user ${member.user.tag} received ${money} Geld`);
            console.log(`new user ${member.user.tag} added to database`);
            const newUser = new GameUser();
            newUser.setUserId(member.user.id);
            newUser.setGuildId(member.guild.id);
            if (daily) {
                newUser.setDaily(new Date());
            }
            if (quizadded) {
                newUser.setQuizadded(1);
            }
            const newUserId = await gameUserDAO.insert(newUser);
            const newBankkonto = new Bankkonten();
            newBankkonto.setBesitzer(newUserId);
            newBankkonto.setCurrentMoney(money);
            newBankkonto.setMoneyGain(money);
            await bankkontenDAO.insert(newBankkonto);
            const newInventar = new Inventar();
            newInventar.setBesitzer(newUserId);
            await inventarDAO.insert(newInventar);
        }
        return money;
    } catch (error) {
        console.log(error);
    }
}

module.exports = giveMoney;