//Import dependencies modules: 
const { ObjectID } = require('bson');
const express = require ('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const path = require("path");
const fs = require("fs");

//CORS
const cors = require("cors");
app.use(cors());

// Config express js
app.use(express.json())
app.set('port',3000)
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    next();
})