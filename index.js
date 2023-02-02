const express = require('express')
const env = require("dotenv")
const cors = require("cors")
env.config({ path: "config.env" })
const PORT = process.env.port
const app = express()


app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log("server up at localhost" + " " + PORT);
});