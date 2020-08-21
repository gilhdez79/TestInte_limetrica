const mongoose = require('mongoose');
const { Long, Double } = require('mongodb');
const Schema = mongoose.Schema;

const RSchema = new Schema({
    id:{
        type:String,
        require:true
    },
    rating:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    site:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    street:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    lat:{
        type:Number,
        require:true
    },
    lng:{
        type:Number ,
        require:true
    }
});

module.exports=  Restuarant = mongoose.model('restaurants',RSchema);