require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
const getTenorGifById = require('../../utils/getTenorGifById');
const { letterEmojiMap } = require('../../utils/letterEmojiMap');
module.exports = async (oldMember, newMember) => {
    const oldStatus = oldMember.premiumSince;
    const newStatus = newMember.premiumSince;
    if (!oldStatus && newStatus) {
        console.log(`user ${newMember.user.tag} boosted`);
        try {
            const targetChannel = newMember.guild.channels.cache.get(process.env.BOOST_ID) || (await newMember.guild.channels.fetch(process.env.BOOST_ID));
            if (!targetChannel) {
                console.log('Fehler, Verlassenschannel gibts nicht');
                return;
            }
            await getTenorGifById("15122766") //old 26899454
                .then(async (gifUrl) => {
                    if (!gifUrl.includes("http")) {
                        console.log("ERROR Boost gif");
                        return;
                    }
                    const boost = new EmbedBuilder()
                        .setColor(0x0033cc)
                        .setAuthor({ name: newMember.user.username, iconURL: newMember.user.displayAvatarURL({ size: 256 }) })
                        .setTitle(`Danke für den Serverboost!❤️`)
                        .setImage(gifUrl);
                    var message = await targetChannel.send({ content: `||<@${newMember.id}>||`, embeds: [boost] });
                    await message.react(letterEmojiMap.get('D'));
                    await message.react(letterEmojiMap.get('A'));
                    await message.react(letterEmojiMap.get('N'));
                    await message.react(letterEmojiMap.get('K'));
                    await message.react(letterEmojiMap.get('E'));
                    await message.react(letterEmojiMap.get('!'));
                })
                .catch((error) => {
                    console.error('ERROR:', error);
                });
        } catch (error) {
            console.log(error);
        }
    } else if (oldStatus && !newStatus) {
        console.log(`user ${newMember.user.tag} removed boost`);
    }
};