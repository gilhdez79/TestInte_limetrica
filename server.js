const express = require('express');
const mongoose =require('mongoose');
const router  = express.Router();
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;

const restaurant= require('./routes/api/restaurant');

const app = express();

//DB
const db = require('./config/keys').mongoURI;

//cconnec mongoose
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    .then(()=>{console.log('Moongose Conectado')})
    .catch(err=>console.log(err));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());    

app.get('/', (req,res)=>{
    res.send('Hola estamos en la raiz');
});

router.get('/test', (req,res)=>{
    res.json({msg:'users Works!'});
});

//Use Router Restaurant Statistic
app.use('/api/restaurant',restaurant);

const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log( `server running on port ${port}`));

 