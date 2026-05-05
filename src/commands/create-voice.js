const {
  SlashCommandBuilder,
  InteractionContextType,
  MessageFlags,
  ChannelType,
} = require('discord.js');
const VoiceChannel = require('../models/VoiceChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-voice')
    .setDescription('Erstelle einen Voicechannel.')
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('Anzahl der Plätze im Voicechannel.')
        .setRequired(true)
        .setMaxValue(99)
        .setMinValue(1),
    )
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  /**
   *
   * @param {Object} param0
   * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction }) => {
    console.log(
      `SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`,
    );
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const amount = interaction.options.get('amount').value;
    const name = interaction.user.username + 's Voicechannel';
    const query = {
      userId: interaction.user.id,
      permanent: false,
      guildId: interaction.guild.id,
    };
    try {
      const existingChannel = await VoiceChannel.findOne(query);
      if (existingChannel) {
        const channel = await client.channels.fetch(existingChannel.channelId);
        if (channel) {
          if (channel.members.size > amount) {
            await interaction.editReply(
              `Du besitzt bereits einen Voicechannel. Auf diesem sind mehr Nutzer als von dir angegebene Plätze. Bitte entferne zuerst Nutzer aus deinem Voicechannel, bevor du die Anzahl der Plätze reduzierst!`,
            );
            return;
          } else {
            await channel.edit({
              userLimit: amount,
            });
            await interaction.editReply(
              `Die Anzahl der Plätze in deinem Voicechannel wurde auf ${amount} geändert!`,
            );
            existingChannel.nutzer = amount;
            await existingChannel.save().catch((e) => {
              console.log(`Error saving updated VoiceChannel ${e}`);
              return;
            });
            return;
          }
        }
      }
      if (interaction.channel.parent) {
        const newChannel = await interaction.channel.parent.children.create({
          name: name,
          type: ChannelType.GuildVoice,
          userLimit: amount,
        });
        const newChannelModel = new VoiceChannel({
          name: name,
          nutzer: amount,
          userId: interaction.user.id,
          permanent: false,
          guildId: interaction.guild.id,
          channelId: newChannel.id,
          creationTime: Date.now(),
        });
        await newChannelModel.save().catch((e) => {
          console.log(`Error saving new VoiceChannel ${e}`);
          return;
        });
        await interaction.editReply(
          `Der Voicechannel ${name} mit ${amount} Plätzen wurde erstellt!`,
        );
      }
    } catch (error) {
      console.log(error);
    }
  },
};
