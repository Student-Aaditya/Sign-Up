const mongoose=require("mongoose");
// const { type } = require("os");

const passportLocalmongoose=require("passport-local-mongoose");

const signSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
})
signSchema.plugin(passportLocalmongoose);

module.exports=mongoose.model("Users",signSchema);