const { application } = require("express");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ 
    fname:{
        type:String,
        required:true
    },
    lname:{
       type:String,
       required: true
    },
    age:{
        type:Number,
        required: true
    },
    height:{
        type:String,
        required: true
    },
    occ:{
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    img:{
        type:String,
        required: true
    },
    desc:{
        type:String,
        required: true
    }}
);

const User = mongoose.model('CharacterInfo', userSchema);


module.exports = User;

