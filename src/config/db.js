const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
            .then(() => {
                console.log("Connected to MongoDB");
            })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;