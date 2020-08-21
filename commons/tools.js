/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Selection of points within specified radius of given lat/lon - Node.js (c) Chris Veness 2020  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurants');

import mysql from 'mysql2/promise.js';

const R = 6371e3; // earth's mean radius in metres
const sin = Math.sin, cos=Math.cos, acos = Math.acos;
const π = Math.PI;

// query selection parameters: latitude, longitude & radius of bounding circle
const lat = Number(process.argv[2]);    // or e.g. req.query.lat (degrees)
const lon = Number(process.argv[3]);    // or e.g. req.query.lon (degrees)
const radius = Number(process.argv[4]); // or e.g. req.query.radius; (metres)

// set up database connection
const Db = await mysql.createConnection({
    host:              process.env.DB_HOST,
    database:          process.env.DB_DATABASE,
    user:              process.env.DB_USER,
    password:          process.env.DB_PASSWORD,
    namedPlaceholders: true,
});

// query points within first-cut bounding box (Lat & Lon should be indexed for fast query)
const sql = `
    Select Id, Postcode, Lat, Lon
    From MyTable
    Where Lat Between :minLat And :maxLat
      And Lon Between :minLon And :maxLon`;
const params = {
    minLat: lat - radius/R*180/π,
    maxLat: lat + radius/R*180/π,
    minLon: lon - radius/R*180/π / cos(lat*π/180),
    maxLon: lon + radius/R*180/π / cos(lat*π/180),
};
const [ pointsBoundingBox ] = await Db.execute(sql, params);
Db.end(); // close connection




// add in distance d = acos( sinφ₁⋅sinφ₂ + cosφ₁⋅cosφ₂⋅cosΔλ ) ⋅ R
pointsBoundingBox.forEach(p => { p.d = acos(sin(p.Lat*π/180)*sin(lat*π/180) +
    cos(p.Lat*π/180)*cos(lat*π/180)*cos(p.Lon*π/180-lon*π/180)) * R })

// filter for points with distance from bounding circle centre less than radius, and sort
const pointsWithinCircle = pointsBoundingBox.filter(p => p.d < radius).sort((a, b) => a.d - b.d);

console.log(pointsWithinCircle); // or e.g. res.render('points', { points: pointsWithinCircle });




getDataGis = async (lat,lon, z)=>{
    
    const params = {
        minLat: lat - radius/R*180/π,
        maxLat: lat + radius/R*180/π,
        minLon: lon - radius/R*180/π / cos(lat*π/180),
        maxLon: lon + radius/R*180/π / cos(lat*π/180),
    };

console.log(params);

    let puntosGis = await Restaurant.find({$and:[{
        "lat": {$lte:params.minLat},
        "lat": {$lt:params.maxLat},
        "lng": {$lte:params.minLon},
        "lng": {$lt:params.maxLon}
    }]
});
    return puntosGis;
}