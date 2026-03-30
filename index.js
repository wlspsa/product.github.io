const path = require("path")
const fs = require("fs")
const http = require("http")

const PORT = 55555

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
        fs.readFile(path.join(__dirname,"db.json"),(err,content)=>{
            if (err) throw err
            res.writeHead(200,{"content-type":"application/json"})
            res.end(content)
        })
    } else {
        res.writeHead(404,{"content-type":"text/html"})
        res.end("<h1>404</h1><br><p>Page not found</p>")
    }
})
server.listen(PORT,()=>{console.log(`Sever started on port: ${PORT}`)})
