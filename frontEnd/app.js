const express = require('express');
var path = require('path');
const config = require('./config/config.json');

// Create Express Server
const app = express();
//設置靜態當
app.use(express.static(__dirname))
//http://0.0.0.0:3800/src/index.html
app.listen(config.proxy.port, config.proxy.ip, function() {
    console.log(`http://${config.proxy.ip}:${config.proxy.port}/src/index.html`)
})