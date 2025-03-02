require('dotenv').config();
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
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

        const leave = new EmbedBuilder()
            .setColor(0x0033cc)
            .setAuthor({ name: guildMember.user.username, iconURL: guildMember.user.displayAvatarURL({ size: 256 }) })
            .setDescription(`<@${guildMember.id}> wird den Haien zum Fraß vorgeworfen.`)
            .setImage('https://media1.tenor.com/m/lPVgOtgFbeIAAAAd/gargamel-walk-the-plank.gif')
            ;
        var messageL = await targetChannel.send({ embeds: [leave] });
        await messageL.react('🇸');
        await messageL.react('🇵');
        await messageL.react('🇷');
        await messageL.react('🇮');
        await messageL.react('🇳');
        await messageL.react('🇬');

        guildMember.send('hallo');

        /*const button = new ButtonBuilder()
            .setCustomId('whyleave')
            .setLabel('Rückmeldung geben')
            .setStyle('Primary');
        const row = new ActionRowBuilder().addComponents(button);
        guildMember.send({
            content: 'Teile uns mit, warum du gegangen bist.',
            components: [row],
        });*/
    } catch (error) {
        console.log(error);
    }
};