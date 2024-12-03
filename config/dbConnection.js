const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // process.env.DATABASE_URI merupakan coonection string dari env var yg sudah kita tambahkan di file .env
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (error) {
        console.log(error);

    }
}

module.exports = connectDB;