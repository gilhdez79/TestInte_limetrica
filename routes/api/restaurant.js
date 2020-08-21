const express = require('express');
const mogoose = require('mongoose');
const math = require('mathjs');
const router= express.Router();

const Restaurant = require('../../models/restaurants');
const { json } = require('body-parser');
router.get('/statistics',(req,res)=>
{
    const result = getDataGis(req.body.latitude, req.body.longitude,req.body.radius).then((data) => {
        console.log(req.body);
        if(data){
            res.json(data);
        }
        else{
            res.json({msg:'No se encotraron los datos solicitados'});
        }
       
    }).catch(err => {
        console.log(err)
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