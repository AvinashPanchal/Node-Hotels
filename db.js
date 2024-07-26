const mongoose = require('mongoose');

// Define MongoDB Connection URL 
const mongoURL= 'mongodb://localhost:27017/hotels' //replace my database "hotels" with your database

// Set up MongoDB Connection
mongoose.connect(mongoURL, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection
const db = mongoose.connection;

// Define Event Listeners for database connection
db.on('connected', ()=> {
    console.log("connected to the MongoDB server");
});

db.on('error', (err)=> {
    console.log("MongoDB connection error:", err);
});

db.on('disconnected', ()=> {
    console.log("MongoDB disconnected");
});

module.exports = db;