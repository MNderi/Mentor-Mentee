const express= require('express');
const app=express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const router=require('./routes/coachappRoutes');
const path= require('path');
const mustache=require('mustache-express');
const connectDB = require('./model/db');
const { connect } = require('http2');
connectDB();
app.engine('mustache',mustache())
app.set('view engine', 'mustache')
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
// Custom middleware to set :funame based on res.locals.username



app.use('/',router);


app.listen(3000, ()=>{
    
    console.log("Welcome to the Coach App")
});

