const mongoose = require('mongoose');

const mongo_URI = "mongodb+srv://martharcoach:vY0T7Iteks8IWVj7@cluster0.v14csrn.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(mongo_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectDB;
