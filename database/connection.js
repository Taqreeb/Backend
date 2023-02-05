const mongoose = require('mongoose');
const DB = process.env.DATABASE;
mongoose.set('strictQuery',false);
mongoose.connect(DB,{
    usenewUrlParser:true,
    useUnifiedTopology:true, 
}).then(()=>{
    console.log("Database connection successful" );
  }).catch((err)=>console.log("Connection not successful " + err));