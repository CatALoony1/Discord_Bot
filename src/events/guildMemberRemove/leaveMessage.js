require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
const getTenorGifById = require('../../utils/getTenorGifById');

/**
 * 
 * @param {import {'discord.js'}.GuildMember} guildMember 
 * @returns 
 */
module.exports = async (guildMember) => {
    if (guildMember.user.bot) return;
    console.log(`user ${guildMember.user.tag} left`);
    try {
        const targetChannel = guildMember.guild.channels.cache.get(process.env.BYE_ID) || (await guildMember.guild.channels.fetch(process.env.BYE_ID));
        if (!targetChannel) {
            console.log('Fehler, Verlassenschannel gibts nicht');
            return;
        }
        await getTenorGifById("15308096")
            .then(async (gifUrl) => {
                if (!gifUrl.includes("http")) {
                    console.log("ERROR Leave gif");
                    return;
                }
                const leave = new EmbedBuilder()
                    .setColor(0x0033cc)
                    .setAuthor({ name: guildMember.user.username, iconURL: guildMember.user.displayAvatarURL({ size: 256 }) })
                    .setDescription(`Schade, dass <@${guildMember.id}> uns verlassen hat. 🥺 Wir wünschen <@${guildMember.id}> alles Gute für den weiteren Weg.`)
                    .setImage(gifUrl);
                await targetChannel.send({ embeds: [leave] });
            })
            .catch((error) => {
                console.error('ERROR:', error);
            });

    } catch (error) {
        console.log(error);
    }
};