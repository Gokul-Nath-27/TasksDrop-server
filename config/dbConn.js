const mongoose = require("mongoose");
const colors = require('colors')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI);
    console.log(`Server connected to: ${conn.connection.host}`.cyan.underline);
  } catch (e) {
    console.log(`MongoDB connection Failed: ${e.message}`.red.underline);
    console.log(e)
  }
};
 
module.exports = connectDB;
