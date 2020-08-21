const MongoClient = require('mongodb').MongoClient;

const uridb ='mongodb+srv://cluster0.xpav8.mongodb.net/examentInter --username gilbert';
// "mongodb+srv://gilbert:examenIntel>@cluster0.xpav8.mongodb.net/examentInter?retryWrites=true&w=majority";
//"mongodb+srv://gilberto.hdez79@gmail.com:Gil79//**@cluster0.xpav8.mongodb.net/examentInter?retryWrites=true&w=majority";
//'mongodb+srv://cluster0.xpav8.mongodb.net/examentInter --username gilberto.hdez79@gmail.com'
MongoClient.connect(uridb, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db)=>{

if(err){
    return console.log('No se puede conectar a MongoDB');
}
console.log('Conectado a Mongo Server!');

db.collection('Restaurants').insertOne({
    
});

db.close();
});