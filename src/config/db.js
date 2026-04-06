const mongoose = require('mongoose');

const connnectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)    
        process.exit(1);   // Stop the app if database fails
    }
}

module.exports = connnectDB;