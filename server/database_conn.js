const mongoose = require("mongoose");

/************DATABASE CONFIGURATION **************/

// Set up default mongoose connection
mongoose.connect('mongodb+srv://sabahth786:Lancers9986@cluster0.tq7dmhe.mongodb.net/webcamvideo');

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "connection error: "));

// Bind connection to success event (to get notification of connection successfull)
db.once("open", function () {
  console.log("Connected successfully");
})

// Modal Schema
const videoSchema = new mongoose.Schema({
  name: String,
  dateModified: Number,
  url: String,
});

// creating model objects
const Recordings = mongoose.model('recordings', videoSchema);


module.exports = { Recordings };
/************ END DATABASE CONFIGURATION **************/