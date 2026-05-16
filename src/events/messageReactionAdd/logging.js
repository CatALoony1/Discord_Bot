const {
  MessageReaction,
  User,
  MessageReactionEventDetails,
} = require('discord.js');
const Config = require('../../models/Config');
/**
 *
 * @param {MessageReaction} reaction
 * @param {User} user
 * @param {MessageReactionEventDetails} details
 * @returns
 */
module.exports = {
  run: async (reaction, user, details) => {
    try {
      const config = await Config.findOne({ key: 'reaction_add' });
      if (!config) {
        return;
      }
      config.value.count = (config.value || 0) + 1;
      await config.save();
    } catch (error) {
      console.log(error);
    }
  },
};
