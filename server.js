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
// Connect to mongodb
let db;

MongoClient.connect('mongodb+srv://sammyrussom:Adonay56@cluster0.zcb8g9h.mongodb.net/', (err,client) => {
    db = client.db('CW2')
})
//Logger Middleware
let logger = (req,res,next) =>{
    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes() +
      ":" +
      current_datetime.getSeconds();
      let method = req.method;
      let url = req.url;
      let status = res.statusCode;
      let log = `[${formatted_date}] ${method}:${url} ${status}`;
      console.log(log);
      next();
    };
    
app.use(logger);

// Return images from images folder
app.use((req, res, next)=>{
    const filePath = path.join(__dirname, 'static', req.url); 
    fs.stat(filePath, (error, fileInfo)=>{
        if(error){
            next()
            return;
        }
        if(fileInfo.isFile()){
            res.sendFile(filePath);
        } else {
            next();
        }
    });
});

// Display message for root path to show tnat Api is Working
app.get('/', (req,res,next) => {
    res.send('Select a collection, e.g., /collection/messages');
})

//Get the collection name
app.param('collectionName', (req,res,next,collectionName) => {
    req.collection = db.collection(collectionName);
    return next();
})

app.get('/collection/:collectionName/:criteria/:query', (req, res,next) => {
    if (!req.body)return {"msg":"failed"}
    
    switch (`${req.params.criteria}`.toLowerCase()) {
        case "lesson":
            req.collection.find({lesson: new RegExp(req.params.query, 'i')}).toArray((e,results)=>{
                if (e) return next(e);
                res.send(results)
            })
            break;
        case "location":
            req.collection.find({location: new RegExp(req.params.query, 'i')}).toArray((e,results)=>{
                if (e) return next(e);
                res.send(results)
            })
            break;
        case "price":
            req.collection.find({price: parseFloat(req.params.query)}).toArray((e,results)=>{
                if (e) return next(e);
                res.send(results)
            })
            break;
        default:
            next(e)
            break;
    }
});
// retrieve all objects from a collection
app.get('/collection/:collectionName',(req,res,next) => {
    req.collection.find({}).toArray((e,results)=>{
        if(e) return next(e)
        res.send(results)
    })
})