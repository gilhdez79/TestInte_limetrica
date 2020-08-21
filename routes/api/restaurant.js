const express = require('express');
const mogoose = require('mongoose');
const math = require('mathjs');
const router= express.Router();

const Restaurant = require('../../models/restaurants');
const { json } = require('body-parser');

router.post('/',(req,res)=>
{
    let params = {
        id:'',
        rating:'',
        name:'',
        site:'',
        email:'',
        phone:'',
        street:'',
        city:'',
        state:'',
        lat:0,
        lng:0
    }
    if(req.body.id)params.id=req.body.id;
    if(req.body.rating)params.rating=req.body.rating;
    if(req.body.name)params.name=req.body.name;
    if(req.body.site)params.site=req.body.site;
    if(req.body.email)params.email=req.body.email;
    if(req.body.phone)params.phone=req.body.phone;
    if(req.body.street)params.street=req.body.street;
    if(req.body.city)params.city=req.body.city;
    if(req.body.state)params.state=req.body.state;
    if(req.body.lat)params.lat=req.body.lat;
    if(req.body.lng)params.lng=req.body.lng;
    
Restaurant.findOne({id:params.id}).then(r=>{
    if(r){
        res.status(400).json({msg:'Hubo errores al guardar los datos'})
    }
})
    
new Restaurant(params
    ).save()
    .then(result=> res.json(result))
    .catch(err=>res.json({msg:'Hubo errores al guardar los datos'}))

});

router.get('/statistics',(req,res)=>
{
    const result = getDataGis(req.body.latitude, req.body.longitude, req.body.radius)
        .then((data) => {
            console.log(req.body);
            if (data) {
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
    let puntosGis = Restaurant.findOneAndDelete({id:req.body.id}).then((r)=>{
        res.json({msg:"Los datos se han eliminado"});
    }, (err)=>{
        res.json({msg:"No se encontró informacion"});

    });

});

router.put('/', (req, res) => {
let params = {
    id:'',
    rating:'',
    name:'',
    site:'',
    email:'',
    phone:'',
    street:'',
    city:'',
    state:'',
    lat:0,
    lng:0
}
if(req.body.id)params.id=req.body.id;
if(req.body.rating)params.rating=req.body.rating;
if(req.body.name)params.name=req.body.name;
if(req.body.site)params.site=req.body.site;
if(req.body.email)params.email=req.body.email;
if(req.body.phone)params.phone=req.body.phone;
if(req.body.street)params.street=req.body.street;
if(req.body.city)params.city=req.body.city;
if(req.body.state)params.state=req.body.state;
if(req.body.lat)params.lat=req.body.lat;
if(req.body.lng)params.lng=req.body.lng;

let actualizar = Restaurant
    .findOneAndUpdate({
        id: params.id
    }, {
        $set: params
    }, {
        new: true
    })
    .then((r) => {
        res.json({
            r
        });
    });
});

getStatist = async (lat,long)=>{
    
    //console.log(`lat a${lat} ${long}`);
    let restaurant = await Restaurant.find({
        lat: lat,
        lng: long
    });
    return restaurant;
}
getDataGis = async (lat, lon, radius) => {

    let arrayOBj = [];
    let arrayDesvStd = [];
    let ratingAvg = 0;
    let sumRating = 0;
    let objeResult = {
        count: 0,
        avg: 0,
        std: 0
    };

    //const radius = 500;
    const R = 6371e3; // earth's mean radius in metres
    const sin = Math.sin,
        cos = Math.cos,
        acos = Math.acos;
    const π = Math.PI;

    const params = {
        minLat: parseFloat(lat) - parseInt(radius) / R * 180 / π,
        maxLat: parseFloat(lat) + parseInt(radius) / R * 180 / π,
        minLon: parseFloat(lon) - parseInt(radius) / R * 180 / π / cos(lat * π / 180),
        maxLon: parseFloat(lon) + parseInt(radius) / R * 180 / π / cos(lat * π / 180),
    };
    //console.log(params);
    let puntosGis = await Restaurant.find({
        $and: [{
            "lat": {$gte: params.minLat},
            "lat": {$lte: params.maxLat},
            "lng": {$gte: params.minLon},
            "lng": {$lte: params.maxLon}
        }]
    });
if(puntosGis){
 
  puntosGis.map(p => {
    let objGis = {
        lat: 0,
        lon: 0,
        c: 0,
        rating:0
    };

 // add in distance d = acos( sinφ₁⋅sinφ₂ + cosφ₁⋅cosφ₂⋅cosΔλ ) ⋅ R
    let dist = acos(sin(p.lat * π / 180) * sin(parseFloat(lat) * π / 180) + cos(p.lat * π / 180) * cos(parseFloat(lat) * π / 180) * cos(p.lng * π / 180 - parseFloat(lon) * π / 180)) * R;

    objGis.lon = p.lng;
    objGis.lat = p.lat;
    objGis.c = dist;
    objGis.rating=p.rating
    arrayOBj.push(objGis);

});


const result = arrayOBj.filter(p => p.c < radius).sort((a, b) => a.c - b.c);
result.map((r) => {
sumRating += parseInt(r.rating);
arrayDesvStd.push(parseInt(r.rating));
});

ratingAvg = sumRating / arrayOBj.length;
objeResult.count = result.length;
objeResult.avg = ratingAvg;
objeResult.std = math.std(arrayDesvStd, 'biased');

return objeResult;
}
else{ return null }

}

module.exports = router;