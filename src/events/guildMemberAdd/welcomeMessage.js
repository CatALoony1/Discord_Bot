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
    console.log(`user ${guildMember.user.tag} joined`);
    const role = guildMember.guild.roles.cache.find(role => role.name === 'Begrüßungskomitee');
    try {
        const targetChannel = guildMember.guild.channels.cache.get(process.env.ALLGEMEIN_ID) || (await guildMember.guild.channels.fetch(process.env.ALLGEMEIN_ID));
        if (!targetChannel) {
            console.log('Fehler, Willkommenschannel gibts nicht');
            return;
        }
        await getTenorGifById("6622282259374419079") //Luna 6622282259374419079
            .then(async (gifUrl) => {
                if (!gifUrl.includes("http")) {
                    console.log("ERROR Welcome gif");
                    return;
                }
                const welcome = new EmbedBuilder()
                    .setColor(0x0033cc)
                    .setAuthor({ name: guildMember.user.username, iconURL: guildMember.user.displayAvatarURL({ size: 256 }) })
                    .setTitle(`Willkommen in LEAFing Reality! 👋`)
                    .setDescription(`Grüße, werter Neuling! Ich bin Sir Blattzelot, euer ritterlicher und stets kultivierter Begleiter hier in LEAFing Reality. Es ist mir eine Ehre, Euch hier begrüßen zu dürfen, <@${guildMember.id}>! Nehmt Euch einen Moment Zeit, um die grünen Weiten dieses Servers zu erkunden und unsere geschätzte Gemeinschaft kennenzulernen. Bei Fragen oder Anliegen stehe ich, Euer treues Blatt, und das gesamte LEAFing Reality Team Euch mit Freude zur Seite! Möge Euer Aufenthalt hier so erfrischend sein wie ein Tropfen Tau!`)
                    .setImage(gifUrl);
                await targetChannel.send({ content: `${role} <@${guildMember.id}>`, embeds: [welcome] });
            })
            .catch((error) => {
                console.error('ERROR:', error);
            });
    } catch (error) {
        console.log(error);
    }
};