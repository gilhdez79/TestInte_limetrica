const express = require('express');
const mongoose =require('mongoose');
const router  = express.Router();
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;

const routertareas= require('./routes/api/routertareas');
const app = express();
app.use(express.json());
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

//Use Router Restaurant Statistic
app.use('/api/tarea',routertareas);

const port = process.env.PORT || 5001;

app.listen(port, ()=>console.log( `server running on port ${port}`));

 