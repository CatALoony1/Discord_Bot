const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');
//const removeXP = require('../utils/removeXP');
//const giveXP = require('../utils/giveXP');
const Config = require("../models/Config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('XP bezogene Befehle.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('give')
                .setDescription('Gibt Nutzer XP.')
                .addUserOption(option =>
                    option.setName('gnutzer')
                        .setDescription('Nutzer der XP erhalten soll')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('gxpmenge')
                        .setDescription('Die Menge an XP die der Nutzer erhalten soll.')
                        .setRequired(true)
                        .setMaxValue(3000)
                        .setMinValue(1)
                )
                .addStringOption(option =>
                    option.setName('ggrund')
                        .setDescription('Der Grund für die Bonus XP')
                        .setRequired(true)
                        .setMinLength(1)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Entfernt XP von Nutzer.')
                .addUserOption(option =>
                    option.setName('rnutzer')
                        .setDescription('Nutzer der XP verlieren soll')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('rxpmenge')
                        .setDescription('Die Menge an XP die dem Nutzer abgezogen werden soll.')
                        .setRequired(true)
                        .setMaxValue(3000)
                        .setMinValue(1)
                )
                .addStringOption(option =>
                    option.setName('rgrund')
                        .setDescription('Der Grund für den Abzug')
                        .setRequired(true)
                        .setMinLength(1)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('multiplier')
                .setDescription('Setzt den Wert mit dem XP multipliziert werden.')
                .addIntegerOption(option =>
                    option.setName('multiplier')
                        .setDescription('Default = 1')
                        .setRequired(true)
                        .setMaxValue(4)
                        .setMinValue(1)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            if (!interaction.inGuild()) {
                interaction.reply('Hier ist doch kein Server!');
                return;
            }
            await interaction.deferReply();
            const subcommand = interaction.options.getSubcommand();
            if (subcommand == 'multiplier') {
                const amount = interaction.options.get('multiplier').value;
                let confQuery = {
                    key: "xpMultiplier",
                    guildId: interaction.guild.id,
                };
                let conf = await Config.findOne(confQuery);
                conf.value = amount;
                await conf.save().catch((e) => {
                    console.log(`Error saving updated xpMultiplier ${e}`);
                    return;
                });
                await interaction.editReply(`XP-Multiplier auf ${amount} gesetzt!`);
                return;
            } else {
                const targetUserId = interaction.options.get('gnutzer')?.value || interaction.options.get('rnutzer')?.value;
                if (!(interaction.guild.members.cache.find(m => m.id === targetUserId)?.id)) {
                    interaction.editReply(`Bei ${targetUserId} handelt es sich nicht um einen Nutzer.`);
                    return;
                }
                const targetUserObj = await interaction.guild.members.fetch(targetUserId);
                let xpAmount = interaction.options.get('gxpmenge')?.value || interaction.options.get('rxpmenge')?.value;
                const reason = interaction.options.get('ggrund')?.value || interaction.options.get('rgrund')?.value;
                if (subcommand == 'give') {
                    //xpAmount = await giveXP(targetUserObj, xpAmount, xpAmount, interaction.channel, false, false, false);
                    await interaction.editReply(`Nutzer ${targetUserObj} hat ${xpAmount} Bonus XP erhalten!\nGrund: ${reason}`);
                } else if (subcommand == 'remove') {
                    //xpAmount = await removeXP(targetUserObj, xpAmount, interaction.channel);
                    await interaction.editReply(`Nutzer ${targetUserObj} wurden ${xpAmount} XP abgezogen!\nGrund: ${reason}`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    options: {
        devOnly: false,
        deleted: true
    },
};