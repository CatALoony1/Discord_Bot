const GameUser = require('../models/GameUser.js');
const Bankkonten = require('../models/Bankkonten.js');
const Inventar = require('../models/Inventar.js');
const Gluecksrad = require('../models/Gluecksrad.js');

async function removeMoney(member, money) {
  const query = {
    userId: member.user.id,
    guildId: member.guild.id,
  };
  try {
    const user = await GameUser.findOne(query).populate('bankkonto');
    if (user) {
      console.log(`user ${member.user.tag} received ${money} Geld`);
      user.bankkonto.currentMoney -= money;
      user.bankkonto.moneyLost += money;
      await user.bankkonto.save().catch((e) => {
        console.log(`Error saving updated bankkonto ${e}`);
        return;
      });
    } else {
      console.log(`user ${member.user.tag} received ${money} Geld`);
      console.log(`new user ${member.user.tag} added to database`);
      const newUser = new GameUser({
        userId: member.user.id,
        guildId: member.guild.id,
      });
      const newBankkonto = new Bankkonten({
        besitzer: newUser._id,
      });
      newBankkonto.currentMoney = money * -1;
      newBankkonto.moneyLost = money;
      const newInventar = new Inventar({
        besitzer: newUser._id,
      });
      await newBankkonto.save();
      await newInventar.save();
      await newUser.save();
    }
    const gluecksrad = await Gluecksrad.findOne({ guildId: member.guild.id });
    gluecksrad.sonderpool += Math.floor(money / 10);
    gluecksrad.save();
    return money;
  } catch (error) {
    console.log(error);
  }
}

module.exports = removeMoney;
