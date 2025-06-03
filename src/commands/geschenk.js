const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const removeMoney = require('../utils/removeMoney');
const giveMoney = require('../utils/giveMoney');
const GameUser = require('../models/GameUser');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('geschenk')
        .setDescription('Verschenke Loserlinge an einen Nutzer (es wird von dir abgezogen).')
        .addMentionableOption(option =>
            option.setName('nutzer')
                .setDescription('Nutzer dem du Loserlinge schenken willst.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('geldmenge')
                .setDescription('Die Menge an Loserlinge die der Nutzer von dir erhalten soll.')
                .setRequired(true)
                .setMinValue(1)
        )
        .addStringOption(option =>
            option.setName('nachricht')
                .setDescription('(optional)Hänge eine Nachricht an das Geschenk.')
                .setRequired(false)
                .setMinLength(1)
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            if (!interaction.inGuild()) {
                interaction.reply('Hier ist doch kein Server!');
                return;
            }
            await interaction.deferReply();
            const targetUserId = interaction.options.get('nutzer').value;
            if (!(interaction.guild.members.cache.find(m => m.id === targetUserId)?.id)) {
                interaction.editReply(`Bei ${targetUserId} handelt es sich nicht um einen Nutzer.`);
                return;
            }
            if (interaction.user.id === targetUserId) {
                interaction.editReply('Du kannst dir selbst keine Loserlinge schenken!');
                return;
            }
            let geldMenge = interaction.options.get('geldmenge').value;
            const user = await GameUser.findOne({ userId: interaction.user.id, guildId: interaction.guild.id }).populate('bankkonto');
            if (!user || !user.bankkonto || user.bankkonto.currentMoney < geldMenge) {
                interaction.editReply(`Du hast nicht genug Loserlinge, um ${geldMenge} Loserlinge zu verschenken!`);
                return;
            }
            const targetUserObj = await interaction.guild.members.fetch(targetUserId);
            const reason = interaction.options.get('nachricht')?.value || "";
            await removeMoney(interaction.member, geldMenge);
            await giveMoney(targetUserObj, geldMenge, false);
            if (reason !== "") {
                await interaction.editReply(`${targetUserObj} du hast ${geldMenge} Loserlinge von ${interaction.member} erhalten!\nAngehängte Nachricht:\n${reason}`);
            } else {
                await interaction.editReply(`${targetUserObj} du hast ${geldMenge} Loserlinge von ${interaction.member} erhalten!`);
            }
        } catch (error) {
            console.log(error);
        }
    },
    options: {
        devOnly: true,
        deleted: false
    },
};