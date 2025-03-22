require('dotenv').config();
const { EmbedBuilder, GuildMember } = require('discord.js');
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
            await getTenorGifById("26899454")
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
                    var message = await targetChannel.send(`||<@${newMember.id}>||`);
                    var reply = await message.reply({ embeds: [boost] });
                    message.delete();
                    await reply.react('🇩');
                    await reply.react('🇦');
                    await reply.react('🇳');
                    await reply.react('🇰');
                    await reply.react('🇪');
                    await reply.react('‼️');
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