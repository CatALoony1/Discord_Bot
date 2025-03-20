const Discord = require("discord.js");
const Question = require('../../models/QuizQuestion');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');

const roles = new Map([[0, 'Landratte'],
[1, 'Deckschrubber'],
[5, 'Leichtmatrose'],
[10, 'Krabbenfänger'],
[15, 'Steuermann'],
[20, 'Fischfänger'],
[25, 'Haijäger'],
[30, 'Navigationsmeister'],
[35, 'Schatzsucher'],
[40, 'Tiefseetaucher']
]);

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === `qvorschlag-${interaction.user.id}`) {
        const targetUser = await interaction.guild.members.fetch(process.env.ADMIN_ID);
        await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral })
        const frage = interaction.fields.getTextInputValue('qvorschlag-frage');
        const richtig = interaction.fields.getTextInputValue('qvorschlag-richtig');
        const falsch1 = interaction.fields.getTextInputValue('qvorschlag-falsch1');
        const falsch2 = interaction.fields.getTextInputValue('qvorschlag-falsch2');
        const falsch3 = interaction.fields.getTextInputValue('qvorschlag-falsch3');
        const vorschlag = new Discord.EmbedBuilder();
        vorschlag.setColor(0x0033cc);
        vorschlag.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }) });
        vorschlag.setTitle(`Fragen Vorschlag`);
        vorschlag.setDescription(frage);
        vorschlag.addFields({ name: `Richig:`, value: `${richtig}` });
        vorschlag.addFields({ name: `Falsch1:`, value: `${falsch1}` });
        vorschlag.addFields({ name: `Falsch2:`, value: `${falsch2}` });
        vorschlag.addFields({ name: `Falsch3:`, value: `${falsch3}` });
        await targetUser.send({ embeds: [vorschlag] });
        interaction.editReply('Frage abgegeben!');
    } else if (interaction.customId.includes(`qaddbyadmin-${interaction.user.id}`)) {
        await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral })
        const frage = interaction.fields.getTextInputValue('qaddbyadmin-frage');
        const richtig = interaction.fields.getTextInputValue('qaddbyadmin-richtig');
        const falsch1 = interaction.fields.getTextInputValue('qaddbyadmin-falsch1');
        const falsch2 = interaction.fields.getTextInputValue('qaddbyadmin-falsch2');
        const falsch3 = interaction.fields.getTextInputValue('qaddbyadmin-falsch3');
        const [type, adminId, mentionedUserId] = interaction.customId.split('-');
        const wrong = `${falsch1}/${falsch2}/${falsch3}`
        const participants = [];
        participants[0] = mentionedUserId;
        const newQuestion = new Question({
            question: frage,
            right: richtig,
            wrong: wrong,
            participants: participants
        });
        await newQuestion.save();
        var targetChannel = interaction.guild.channels.cache.get(process.env.QUIZ_ID) || (await interaction.guild.channels.fetch(process.env.QUIZ_ID));
        const targetUserObj = await interaction.guild.members.fetch(mentionedUserId);
        var xpToGive = 40;
        try {
            const level = await Level.findOne({
                userId: mentionedUserId,
                guildId: interaction.guild.id,
            });
            if (level) {
                if (targetUserObj.some(role => role.name === 'Bumper')) {
                    let now = new Date();
                    let lastbump = level.lastBump;
                    let diffTime = Math.abs(now - lastbump);
                    let diffHour = Math.floor(diffTime / (1000 * 60 * 60));
                    if (diffHour >= 24) {
                        let tempRole = interaction.guild.roles.cache.find(role => role.name === 'Bumper');
                        await targetUserObj.roles.remove(tempRole);
                        console.log(`Role Bumper was removed from user ${targetUserObj.user.tag}`);
                    } else {
                        xpToGive = Math.ceil(xpToGive * 1.1);
                    }
                };
                console.log(`user ${targetUserObj.user.tag} received ${xpToGive} Bonus XP (Quiz)`);
                level.xp += xpToGive;
                level.allxp += xpToGive;
                level.thismonth += xpToGive;
                level.bonusclaimed += xpToGive;
                level.lastMessage = Date.now();
                level.quizadded += 1;
                if (level.xp >= calculateLevelXp(level.level)) {
                    level.xp = level.xp - calculateLevelXp(level.level);
                    level.level += 1;
                    console.log(`user ${targetUserObj.user.tag} reached level ${level.level}`);
                    let description = `🎉 Glückwunsch ${targetUserObj}! Du hast **Level ${level.level}** erreicht!⚓`;
                    if (roles.has(level.level)) {
                        let newRole = roles.get(level.level);
                        description = `🎉 Glückwunsch ${targetUserObj}! Du hast **Level ${level.level}** erreicht und bist somit zum ${newRole} aufgestiegen!⚓`;

                        for (const value of roles.values()) {
                            if (targetUserObj.roles.cache.some(role => role.name === value)) {
                                let tempRole = interaction.guild.roles.cache.find(role => role.name === value);
                                await interaction.guild.members.cache.get(targetUserObj.id).roles.remove(tempRole);
                                console.log(`Role ${value} was removed from user ${targetUserObj.user.tag}`);
                            }
                        }
                        let role = interaction.guild.roles.cache.find(role => role.name === newRole);
                        await interaction.guild.members.cache.get(targetUserObj.id).roles.add(role);
                        console.log(`Role ${newRole} was given to user ${targetUserObj.user.tag}`);
                        if (level.level === 1) {
                            let memberRole = interaction.guild.roles.cache.find(role => role.name === 'Mitglied');
                            await interaction.guild.members.cache.get(targetUserObj.id).roles.add(memberRole);
                            console.log(`Role Mitglied was given to user ${targetUserObj.user.tag}`);
                        }
                    }
                    const embed = new Discord.EmbedBuilder()
                        .setTitle('Glückwunsch!')
                        .setDescription(description)
                        .setThumbnail(targetUserObj.user.displayAvatarURL({ format: 'png', dynamic: true }))
                        .setColor(0x0033cc);
                    targetChannel.send({ embeds: [embed] });
                }
                await level.save().catch((e) => {
                    console.log(`Error saving updated level ${e}`);
                    return;
                });
            } else {
                console.log(`user ${targetUserObj.user.tag} received ${xpToGive} Bonus XP (Quiz)`);
                console.log(`new user ${targetUserObj.user.tag} added to database`);
                const newLevel = new Level({
                    userId: targetUserObj.user.id,
                    guildId: interaction.guild.id,
                    xp: xpToGive,
                    allxp: xpToGive,
                    messages: 0,
                    lastMessage: Date.now(),
                    userName: targetUserObj.user.tag,
                    messagexp: 0,
                    voicexp: 0,
                    voicetime: 0,
                    thismonth: xpToGive,
                    bonusclaimed: xpToGive,
                    quizadded: 1
                });
                await newLevel.save();
            }
        } catch (error) {
            console.log(`Error giving bonus xp: ${error}`);
        }
        interaction.editReply('Frage eingetragen!');
    }
};