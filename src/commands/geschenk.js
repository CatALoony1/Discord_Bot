const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const removeXP = require('../utils/removeXP');
const giveXP = require('../utils/giveXP');
const Level = require('../models/Level');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('geschenk')
        .setDescription('Verschenke XP an einen Nutzer (sie werden von dir abgezogen).')
        .addMentionableOption(option =>
            option.setName('nutzer')
                .setDescription('Nutzer dem du XP schenken willst.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('xpmenge')
                .setDescription('Die Menge an XP die der Nutzer von dir erhalten soll.')
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
                interaction.editReply('Du kannst dir selbst keine XP schenken!');
                return;
            }
            let xpAmount = interaction.options.get('xpmenge').value;
            //check if user has at least xpAmount XP
            const level = await Level.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            if (!level || level.xp < xpAmount) {
                interaction.editReply(`Du hast nicht genug XP, um ${xpAmount}XP zu verschenken!`);
                return;
            }
            const targetUserObj = await interaction.guild.members.fetch(targetUserId);
            const reason = interaction.options.get('nachricht')?.value || "";
            await removeXP(interaction.member, xpAmount, interaction.channel);
            await giveXP(targetUserObj, xpAmount, xpAmount, interaction.channel, false, false, false);
            if (reason !== "") {
                await interaction.editReply(`${targetUserObj} du hast ${xpAmount}XP von ${interaction.member} erhalten!\nAngehängte Nachricht:\n${reason}`);
            } else {
                await interaction.editReply(`${targetUserObj} du hast ${xpAmount}XP von ${interaction.member} erhalten!`);
            }
        } catch (error) {
            console.log(error);
        }
    },
};