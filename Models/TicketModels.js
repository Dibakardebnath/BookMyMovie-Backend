const mongoose = require('mongoose')

const ticketschema=new mongoose.Schema({
    
    Title:"String",
    Year:"Number",
    imdbID:"String",
    Type:"String",
    Poster:"String",
    Seats:"Array",
},{
    timestamps:true,
    
})
const TicketModels=mongoose.model('ticket',ticketschema)

module.exports ={TicketModels}