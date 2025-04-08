const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const giveXP = require('../utils/giveXP');
const removeXP = require('../utils/removeXP');
const getTenorGif = require('../utils/getTenorGif');
const Config = require('../models/Config');
const BotState = require('../models/BotState');

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('geheimer-befehl')
        .setDescription('Geheim!')
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction, client }) => {
        await interaction.deferReply();
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const targetUserId = interaction.member.id;
            const targetUserObj = await interaction.guild.members.fetch(targetUserId);
            const zufallszahl = getRandom(1, 10);
            if (zufallszahl == 1) {
                const duration = getRandom(1, 7200);
                targetUserObj.timeout(5 * 60 * 1000, 'Berühre keine Sachen, die du nicht berühren solltest!')
                    .then(console.log)
                    .catch(console.error);
                await interaction.editReply(`Du wurdest für ${duration} Sekunden getimeoutet!`);
            } else if (zufallszahl == 2) {
                let amount = getRandom(1, 100);
                amount = await giveXP(targetUserId, amount, amount, interaction.channel, false, false, false);
                await interaction.editReply(`Dieser Befehl ist geheim, deshalb erhälst du ${amount}XP Schweigegeld!`);
            } else if (zufallszahl == 3) {
                let amount = getRandom(1, 200);
                amount = await removeXP(targetUserObj, amount, interaction.channel);
                await interaction.editReply(`Hör auf diesen Befehl zu benutzen, ich ziehe dir als Strafe ${amount}XP ab!`);
            } else if (zufallszahl == 4) {
                await getTenorGif('Stop it')
                    .then((gifUrl) => {
                        interaction.editReply(gifUrl);
                    })
                    .catch((error) => {
                        console.error('ERROR:', error);
                    });
            } else if (zufallszahl == 5) {
                await getTenorGif('Please die')
                    .then((gifUrl) => {
                        interaction.editReply(gifUrl);
                    })
                    .catch((error) => {
                        console.error('ERROR:', error);
                    });
            } else if (zufallszahl == 6) {
                client.emit('guildMemberRemove', targetUserObj);
                await interaction.editReply(`Bye`);
            } else if (zufallszahl == 7) {
                const config = await Config.findOne({
                    key: 'quizTimeout',
                });
                config.value = `${config.value}${targetUserId},`;
                await interaction.editReply(`Hier passieren geheime Sachen!`);
            } else if (zufallszahl == 8) {
                if (!targetUserObj.roles.cache.some(role => role.name === 'Geheimniswahrer')) {
                    const role = interaction.guild.roles.cache.find(role => role.name === 'Geheimniswahrer');
                    await targetUserObj.roles.add(role);
                    console.log(`Role Geheimniswahrer was given to user ${targetUserObj.user.tag}`);
                    await interaction.editReply({ content: `Das Geheimnis ist "Grünkohl".`, flags: MessageFlags.Ephemeral });
                } else {
                    console.log(`User is already Geheimniswahrer`);
                    await interaction.editReply('Du bist bereits im Wissen des Geheimnisses.');
                }
            } else if (zufallszahl == 9) {
                var state = await BotState.findOne({
                    guildId: interaction.guild.id,
                });
                var hornycount = state.hornyCount + 1;
                await interaction.editReply('Ein geheimnisvoller Zähler wurde soeben hochgetählt!');
                if (hornycount == 100) {
                    hornycount = 0;
                    state.state = 'horny';
                    state.startTime = Date.now();
                    await interaction.editReply('Ich bin jetzt horny!💦');
                }
                state.hornyCount = hornycount;
                state.save();
            } else if (zufallszahl == 10) {
                await targetUserObj.setNickname('Neugieriges Stück', 'Wollte das Geheimnis wissen.')
                    .then(member => console.log(`Set nickname of ${member.user.username}`))
                    .catch(console.error);
                await interaction.editReply('Dein neuer Name passt besser zu dir!');
            }
        } catch (error) {
            console.log(error);
        }
    },
};