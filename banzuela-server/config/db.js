const mongoose = require("mongoose");
const { MONGO_DB_URL } = require("./config");

const connectDB = async () => {
  try {
    if (!MONGO_DB_URL) {
      throw new Error("MONGO_URI is not defined in the .env file.");
    }

    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(MONGO_DB_URL, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected Successfully");
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;
