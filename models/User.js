const { default: mongoose } = require("mongoose");

const newsSchema = new mongoose.Schema({

               
    title:{type:String,require:true},
    text:{type:String,require:true},
    category:{type:String,require:true},
    imageLink:{type:String},
    Date:{type:Date}


});
const userSchema=new mongoose.Schema({
username:{
type:String,
  required:true

},

password:{

    type:String,
    required:true
},

pantry:[newsSchema],




})
const User=mongoose.model("User",userSchema)
module.exports= User;
