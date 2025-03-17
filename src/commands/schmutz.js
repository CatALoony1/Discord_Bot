const { SlashCommandBuilder, MessageFlags } = require('discord.js');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('schmutz')
        .setDescription('SCHMUTZ')
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('NachrichtID')
                .setMinLength(18)
                .setRequired(true)
        ),

    run: async ({ interaction, client }) => {
        if (interaction.user.id != process.env.ADMIN_ID) {
            interaction.reply('Du darfst das nicht!!!!');
            return;
        }
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const id = interaction.options.get('messageid').value;
            const fetchedMessage = await interaction.channel.messages.fetch(id);
            //await fetchedMessage.react('🇸');
           // await fetchedMessage.react('🇨');
         //   await fetchedMessage.react('🇭');
          //  await fetchedMessage.react('🇲');
       //     await fetchedMessage.react('🇺');
       //     await fetchedMessage.react('🇹');
     //       await fetchedMessage.react('🇿');
const prompt = message.content;
const genAI = new GoogleGenerativeAI(process.env.AI_API);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const result = await model.generateContent(String(prompt)); console.log(result.response.text());
          await interaction.editReply('Erledigt!');
        } catch (err) {
            console.log(err);
        }
    },
    options: {
        devOnly: true,
    },
};