const mongoose = require('mongoose');
require('dotenv').config();
module.exports = async () => {
  try {
    mongoose.set('strictQuery', false);
    mongoose.set('debug', (collectionName, method, query, doc) => {
      console.log(
        `Mongoose: ${collectionName}.${method}`,
        JSON.stringify(query),
        doc,
      );
    });
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};
