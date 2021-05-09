/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var http = require("http");
var url = require("url");
var fs = require("fs");

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    console.log(q.pathname);
    var filename = q.pathname;
    var template = "";
    var mimeType = "";
    
    switch(filename) {
        case "/":
            template = "./public/index.html";
            mimeType = "text/html";
            break;
        case "/css/style.css":
            template = "./public/css/style.css";
            mimeType = "text/css";
            break;
        case "/js/kagi.js":
            template = "./public/js/kagi.js";
            mimeType = "application/javascript";
            break;
        case "/js/data.js":
            template = "./public/js/data.js";
            mimeType = "application/javascript";
            break;
        case "/js/main.js":
            template = "./public/js/main.js";
            mimeType = "application/javascript";
            break;
        case "/js/HistoricalData.js":
            template = "./public/js/HistoricalData.js";
            mimeType = "application/javascript";
            break;
        case "/js/WebSocket.js":
            template = "./public/js/WebSocket.js";
            mimeType = "application/javascript";
            break;
    }
    
    console.log(template);
    fs.readFile(template, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        else
        {
            res.writeHead(200, {'Content-Type': mimeType});
            res.write(data);
            return res.end();
        }
    });
    
}).listen(8080);
