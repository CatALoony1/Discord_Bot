require('dotenv').config();
const {
  MessageReaction,
  User,
  MessageReactionEventDetails,
} = require('discord.js');
/**
 *
 * @param {MessageReaction} reaction
 * @param {User} user
 * @param {MessageReactionEventDetails} details
 * @returns
 */
module.exports = {
  run: async (reaction, user, details) => {
    console.log(reaction);
    console.log(user);
    console.log(details);
    console.log(`Reaction partial? ${reaction.partial}`);
  },
};
