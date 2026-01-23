const { Schema, model } = require('mongoose');
const { randomUUID } = require('crypto');

const quizQuestionSchema = new Schema({
  questionId: {
    type: String,
    default: randomUUID,
  },
  question: {
    type: String,
    required: true,
  },
  right: {
    type: String,
    required: true,
  },
  wrong: {
    type: String,
    required: true,
  },
  started: {
    type: Date,
  },
  participants: {
    type: [String],
    default: [],
  },
  asked: {
    type: String,
    default: 'N',
  },
  rightChar: {
    type: String,
  },
  answerA: {
    type: Number,
    default: 0,
  },
  answerB: {
    type: Number,
    default: 0,
  },
  answerC: {
    type: Number,
    default: 0,
  },
  answerD: {
    type: Number,
    default: 0,
  },
  guildId: {
    type: String,
    required: true,
  },
});

module.exports = model('QuizQuestion', quizQuestionSchema);
