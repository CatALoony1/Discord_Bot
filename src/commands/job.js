const bumpReminderJob = require('../jobs/cronJob_bumpReminder');
const checkBumperRoleJob = require('../jobs/cronJob_checkBumperRole');
const checkInactiveJob = require('../jobs/cronJob_checkInactive');
const customStatusJob = require('../jobs/cronJob_customStatus');
const geburtstagJob = require('../jobs/cronJob_geburtstag');
const goodMorningJob = require('../jobs/cronJob_goodMorning');
const monthlyXPJob = require('../jobs/cronJob_monthlyXP');
const newYearJob = require('../jobs/cronJob_newYear');
const quizQuestionJob = require('../jobs/cronJob_quizQuestion');
const quizStatsJob = require('../jobs/cronJob_quizStats');
const renameLogFileJob = require('../jobs/cronJob_renameLogFile');
const voiceXPJob = require('../jobs/cronJob_voiceXp');
const missingXpJob = require('../jobs/cronJob_checkMissingXP');
const checkNewAnimalsJob = require('../jobs/checkNewAnimals');
const zinsenJob = require('../jobs/cronJob_zinsen');
const checkActiveItemsJob = require('../jobs/cronJob_checkActiveItems');


const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('job')
        .setDescription('Sendet ein zufälliges GIF zu einem Begriff.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Starte den Job.')
                .addStringOption(option =>
                    option.setName('job')
                        .setDescription('Job der gestartet werden soll.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'bumpReminder', value: 'bumpReminder' },
                            { name: 'checkBumperRole', value: 'checkBumperRole' },
                            { name: 'checkInactive', value: 'checkInactive' },
                            { name: 'customStatus', value: 'customStatus' },
                            { name: 'geburtstag', value: 'geburtstag' },
                            { name: 'goodMorning', value: 'goodMorning' },
                            { name: 'monthlyXP', value: 'monthlyXP' },
                            { name: 'newYear', value: 'newYear' },
                            { name: 'quizQuestion', value: 'quizQuestion' },
                            { name: 'quizStats', value: 'quizStats' },
                            { name: 'renameLogFile', value: 'renameLogFile' },
                            { name: 'voiceXP', value: 'voiceXP' },
                            { name: 'missingXp', value: 'missingXp' },
                            { name: 'zinsen', value: 'zinsen' },
                            { name: 'checkActiveItems', value: 'checkActiveItems' },
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stoppe den Job.')
                .addStringOption(option =>
                    option.setName('job')
                        .setDescription('Job der gestoppt werden soll.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'bumpReminder', value: 'bumpReminder' },
                            { name: 'checkBumperRole', value: 'checkBumperRole' },
                            { name: 'checkInactive', value: 'checkInactive' },
                            { name: 'customStatus', value: 'customStatus' },
                            { name: 'geburtstag', value: 'geburtstag' },
                            { name: 'goodMorning', value: 'goodMorning' },
                            { name: 'monthlyXP', value: 'monthlyXP' },
                            { name: 'newYear', value: 'newYear' },
                            { name: 'quizQuestion', value: 'quizQuestion' },
                            { name: 'quizStats', value: 'quizStats' },
                            { name: 'renameLogFile', value: 'renameLogFile' },
                            { name: 'voiceXP', value: 'voiceXP' },
                            { name: 'missingXp', value: 'missingXp' },
                            { name: 'zinsen', value: 'zinsen' },
                            { name: 'checkActiveItems', value: 'checkActiveItems' },
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('execute')
                .setDescription('Führe den Job aus.')
                .addStringOption(option =>
                    option.setName('job')
                        .setDescription('Job der ausgeführt werden soll.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'quizQuestion', value: 'quizQuestion' },
                            { name: 'quizStats', value: 'quizStats' },
                            { name: 'geburtstag', value: 'geburtstag' },
                            { name: 'checkNewAnimals', value: 'checkNewAnimals' },
                        )
                )
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} ${interaction.options.getSubcommand()} was executed by user ${interaction.member.user.tag}`);
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        try {
            const subcommand = interaction.options.getSubcommand();
            const job = interaction.options.get('job').value;
            let jobClass = null;
            switch (job) {
                case 'bumpReminder':
                    jobClass = bumpReminderJob;
                    break;
                case 'checkBumperRole':
                    jobClass = checkBumperRoleJob;
                    break;
                case 'checkInactive':
                    jobClass = checkInactiveJob;
                    break;
                case 'customStatus':
                    jobClass = customStatusJob;
                    break;
                case 'geburtstag':
                    jobClass = geburtstagJob;
                    break;
                case 'goodMorning':
                    jobClass = goodMorningJob;
                    break;
                case 'monthlyXP':
                    jobClass = monthlyXPJob;
                    break;
                case 'newYear':
                    jobClass = newYearJob;
                    break;
                case 'quizQuestion':
                    jobClass = quizQuestionJob;
                    break;
                case 'quizStats':
                    jobClass = quizStatsJob;
                    break;
                case 'renameLogFile':
                    jobClass = renameLogFileJob;
                    break;
                case 'voiceXP':
                    jobClass = voiceXPJob;
                    break;
                case 'missingXp':
                    jobClass = missingXpJob;
                    break;
                case 'checkNewAnimals':
                    jobClass = checkNewAnimalsJob;
                    break;
                case 'zinsen':
                    jobClass = zinsenJob;
                    break;
                case 'checkActiveItems':
                    jobClass = checkActiveItemsJob;
                    break;
                default:
                    throw new Error(`Unbekannter Job: ${job}`);
            }
            if (subcommand === 'start') {
                if (!jobClass.isRunning()) {
                    jobClass.startJob(client);
                    await interaction.editReply({ content: `Job ${job} wurde erfolgreich gestartet.` });
                } else {
                    await interaction.editReply({ content: `Job ${job} läuft bereits.` });
                }
            } else if (subcommand === 'stop') {
                if (jobClass.isRunning()) {
                    jobClass.stopJob();
                    await interaction.editReply({ content: `Job ${job} wurde erfolgreich gestoppt.` });
                } else {
                    await interaction.editReply({ content: `Job ${job} läuft nicht.` });
                }
            } else if (subcommand === 'execute') {
                await jobClass.jobFunction(client);
                await interaction.editReply({ content: `Job ${job} wurde erfolgreich ausgeführt.` });
            }
        } catch (error) {
            console.log(error);
        }
    },
    options: {
        devOnly: true,
        deleted: false,
    },
};