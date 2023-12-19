const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(mongo_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectDB;
