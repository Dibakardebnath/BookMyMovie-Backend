

const mongoose = require('mongoose')

const userschema=new mongoose.Schema({
    id:"String",
    Title:"String",
    Year:"Number",
    imdbID:"String",
    Type:"String",
    Poster:"String"
},{
    timestamps:true,
    
})
const UserModel=mongoose.model('user',userschema)

module.exports ={UserModel}












/*"Title": "Everything Everywhere All at Once",
      "Year": "2022",
      "imdbID": "tt6710474",
      "Type": "movie",
      "Poster": */