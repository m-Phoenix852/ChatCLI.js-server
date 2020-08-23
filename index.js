const express = require('express');
const app = express();
const config = require('./config.js');
const http = require('http');
const server = http.createServer(app);

server.listen(config.PORT, () => {
    console.log(`Server is listening on port ${config.PORT}!`);
    require('./chatworker.js').run(server)
})