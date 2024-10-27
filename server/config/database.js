const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Construct the full MongoDB URI
    const uri = `${process.env.MONGODB_URI}${process.env.MONGODB_DB}`;

    console.log("Connecting to MongoDB...");
    console.log(`URI: ${uri}`);

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
