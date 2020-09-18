const express = require('express');
const mogoose = require('mongoose');
const math = require('mathjs');
const router= express.Router();

const Tarea = require('../../models/tareas');
const { json } = require('body-parser');
const { re } = require('mathjs');

router.post('/registra',(req,res)=>
{
        let params = {
            id_tarea:'',
            descripcion:'',
            duracion:0,
            fecha:''
        }
        if(req.body.id_tarea)params.id_tarea=req.body.id_tarea;
        if(req.body.descripcion)params.descripcion=req.body.descripcion;
        if(req.body.duracion)params.duracion=req.body.duracion;
        if(req.body.duracion)params.fecha=req.body.fecha;
        if(req.body.completa)params.fecha=req.body.completa;
        if(req.body.tiempocomp)params.fecha=req.body.tiempocomp;

       /* params.id_tarea ='T01';
        params.descripcion ="Tarea Principal";
        params.duracion='25:00',
        params.fecha = '15/09/2020' */
        ttotal =0;
        const totalTaras = getAllTareas()
        .then((data) => {
            if (data.length >0 ) {
              ttotal = data.length;
            }  
            params.id_tarea = "T" + ttotal;
            console.log(params);
            Tarea.findOne({id_tarea: params.id_tarea}).then(r => {
                if (r) {
                    res.status(400).json({
                        msg: 'Ya existe una Tara con ese codigo'
                    })
                }
            });

            new Tarea(params).save()
                .then(result => res.json(result))
                .catch(err => res.json({
                    msg: 'Hubo errores al guardar los datos'
                }))
            }).catch(err => {
                console.log(err)
                res.json({
                    msg: 'Hubo errores al guardar los datos'
                })
            });
});
router.get('/all',(req,res)=>
{
    const result = getAllTareas()
        .then((data) => {
            if (data.length >0 ) {
                res.json(data);
            } else {
                res.json({
                    msg: 'No se encotraron los datos solicitados'
                });
            }

        }).catch(err => {
            console.log(err)
        });

});
// Obtener Tareas Completas/pendientes
router.get('/getstatus/:status',(req,res)=>
{
    console.log(req.params.status)
    status =  req.params.status
    const result = getTareasStatus(status)
        .then((data) => {
            if (data.length >0 ) {
                res.json(data);
            } else {
                res.json({
                    msg: 'No se encotraron los datos solicitados'
                });
            }

        }).catch(err => {
            console.log(err)
        });

});

router.get('/',(req,res)=>
{
    const result = getTareas(req.body.id_tarea)
        .then((data) => {
            console.log(req.body);
            if (data.length >0 ) {
                res.json(data);
            } else {
                res.json({
                    msg: 'No se encotraron los datos solicitados'
                });
            }

        }).catch(err => {
            console.log(err)
        });

});
router.delete('/delete',(req,res)=>
{
    let tarea = Tarea.findOneAndDelete({id_tarea:req.body.id_tarea}).then((r)=>{
        res.json({msg:"Los datos se han eliminado"});
    }, (err)=>{
        res.json({msg:"No se encontró informacion"});

    });

});

router.put('/', (req, res) => {

    let params = {
        id_tarea:'',
        descripcion:'',
        duracion:'',
        fecha : '',
        completo:0,
        tiempocomp:"0"
    }

if(req.body.id_tarea)params.id_tarea=req.body.id_tarea    ;
if(req.body.descripcion)params.descripcion=req.body.descripcion;
if(req.body.duracion)params.duracion=req.body.duracion;
if(req.body.fecha)params.fecha=req.body.fecha;
if(req.body.completo)params.completo=req.body.completo;
if(req.body.tiempocomp)params.tiempocomp=req.body.tiempocomp;

console.log(params);

let updatetarea = Tarea
.findOneAndUpdate(
    {id_tarea:req.body.id_tarea},
    {$set : {"duracion":req.body.duracion,"descripcion":req.body.descripcion, "fecha": req.body.fecha,  "completo": req.body.completo,  "tiempocomp": req.body.tiempocomp}})
.then((r)=>{
    res.json({msg:"Los datos se han Actualizado"});
}, (err)=>{
    res.json({msg:"No se encontró informacion"});

});

});

getTareas = async id_tarea =>{
    
    //console.log(`lat a${lat} ${long}`);
    let tarea = await Tarea.find({
        id_tarea: id_tarea    
    });
    return tarea;
}
  getAllTareas= async() =>{
    
    //console.log(`lat a${lat} ${long}`);
    let tarea = await Tarea.find({});
    return tarea;
}

getTareasStatus= async(status) =>{
    
    //console.log(`lat a${lat} ${long}`);
    let tarea = await Tarea.find({'completo':status});
    return tarea;
}
updateTareas = async id_tarea =>{
    
    //console.log(`lat a${lat} ${long}`);
    let tarea = await Tarea.findAndUpdate({
        "id_tarea": id_tarea},
        {$set : {"duracion":"00:10:00"}},
        
        );
    return tarea;
}


module.exports = router;