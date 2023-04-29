//Import
const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const env = require("dotenv");
env.config({ path: 'config.env' });
const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log("server up at localhost" + " " + PORT);
  });