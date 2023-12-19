const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongo_URI = process.env.MONGO_URI; // Use process.env to access environment variables
    if (!mongo_URI) {
      throw new Error('MongoDB URI is not defined in the environment variables.');
    }

    await mongoose.connect(mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = connectDB;
