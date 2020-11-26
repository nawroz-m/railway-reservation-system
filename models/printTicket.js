var mongoose = require("mongoose"); 
var passportLocalMongoose = require("passport-local-mongoose");

var TicketSchema = new mongoose.Schema({
   stratDest: String,
   endDest: String,
   name: String,
   age: Number,
   currentAddress: String,
   data: {type: Date, default: Date.now}
});

TicketSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Ticket", TicketSchema);