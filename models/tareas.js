const mongoose = require('mongoose');
const { Long, Double } = require('mongodb');
const Schema = mongoose.Schema;

const RSchema = new Schema({
    id_tarea:{
        type:String,
        require:true
    },
    descripcion:{
        type:String,
        require:true
    },
    duracion:{
        type:String,
        require:true
    },
    fecha:{
        type:Date,
        require:true
    },
    completo:{
        type:Number,
        require:false
    },
    tiempocomp:{
        type:String,
        require:false
    }
});

module.exports=  Tareas = mongoose.model('tareas',RSchema);