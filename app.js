const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser=require('cookie-parser')
const admin = require('./router/admin/routes')
const user=require('./router/user/routes')
const vendor=require('./router/vendor/routes')
const auth=require('./router/auth/routes')
const business=require('./router/business/routes')
const review=require('./router/reviews/routes')
const bodyParser = require('body-parser')


require('./db/conn');
app.use(cookieParser())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

//routes
app.use('/auth', auth);
app.use('/user', user);
app.use('/user', review);
app.use('/vendor', vendor);
app.use('/vendor', business);

app.get('/',(req,res) => {
  res.send("Welcome To Taqreeb");
});

app.use((req,res,next) => {
  res.status(404).json( {
      error: 'Bad Request: URL not found'
  })
})

module.exports =app;

