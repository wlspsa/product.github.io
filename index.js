const path = require("path")
const fs = require("fs")
const http = require("http")
const { MongoClient } = require("mongodb");

const PORT = 55555


//dns black magic
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1'])

require('dotenv').config({debug : true});

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Connect once when the server starts, reuse the connection
let catbox_services;

async function connectDB() {
    try {
        await client.connect();
        catbox_services = client.db("productDB").collection("catboxdb");
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("MongoDB connection failed:", e);
        process.exit(1);
    }
}

const server = http.createServer((req,res)=>{
    if (req.url==="/"){
        fs.readFile(path.join(__dirname,"index.html"),(err,content)=>{
            if (err) throw err
            res.writeHead(200,{"content-type":"text/html"})
            res.end(content)
        })
    } else if (req.url==="/script.js"){
        fs.readFile(path.join(__dirname,"script.js"),(err,content)=>{
            if (err) throw err
            res.writeHead(200,{"content-type":"text/js"})
            res.end(content)
        })
    } else if (req.url==="/style.css"){
        fs.readFile(path.join(__dirname,"style.css"),(err,content)=>{
            if (err) throw err
            res.writeHead(200,{"content-type":"text/css"})
            res.end(content)
        })
    } else if (req.url==="/BoxCat.jpg"){
        fs.readFile(path.join(__dirname,"BoxCat.jpg"),(err,content)=>{
            if (err) throw err
            res.writeHead(200,{"content-type":"image/jpeg"})
            res.end(content)
        })
    }  else if (req.url==="/OtherCat.jpg"){
        fs.readFile(path.join(__dirname,"OtherCat.jpg"),(err,content)=>{
            if (err) throw err
            res.writeHead(200,{"content-type":"image/jpeg"})
            res.end(content)
        })
    } else if (req.url==="/api"){
        console.log("API request!")
        catbox_services.find({}).toArray()
            .then(results => {
                console.log(`Here are my results:${results}`)
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            })
            .catch(err => {
                console.log(err)
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Failed to fetch data" }));
            });
    } else {
        res.writeHead(404,{"content-type":"text/html"})
        res.end("<h1>404</h1><br><p>Page not found</p>")
    }
})
connectDB().then(()=>server.listen(PORT,()=>{console.log(`Sever started on port: ${PORT}`)}))
