const express = require('express');
const router = require('../routes/api')
const app = express();


const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');

let URL = 'mongodb://localhost:27017/yourdb';
let option = {user: 'youruser', pass: 'yourpassword', autoIndex:true};

mongoose.coonect(URL, option).then((res)=>{
    console.log('Database Connected')
}).catch((err)=>{
    console.log(err)
})



app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(helmet());

app.use(express.json({limit: '50kb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3000, 
    message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

app.use("/api/v1", router);

app.use(express.static('client/dist'));

app.get('/*', function(req, res){
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});

module.exports = app;