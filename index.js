const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser=require('cookie-parser')
const admin = require('./router/admin/routes')
const user=require('./router/user/routes')
const vendor=require('./router/vendor/routes')
const auth=require('./router/auth/routes')
const business=require('./router/business/routes')
const review=require('./router/reviews/routes')
const bodyParser = require('body-parser')
const env = require("dotenv");
env.config({ path: 'config.env' });
require('./db/conn');
app.use(cookieParser())
app.use(cors());
app.options('*', cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//routes
app.use('/auth', auth);
app.use('/user', user);
app.use('/user', review);
app.use('/vendor', vendor);
app.use('/vendor', business);
app.use('/admin', admin);

app.get('/',(req,res) => {
  res.send("Welcome To Taqreeb");
});

app.use((req,res,next) => {
  res.status(404).json( {
      error: 'Bad Request: URL not found'
  })
})


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("server up at localhost" + " " + PORT);
});