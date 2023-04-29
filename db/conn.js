const mongoose = require('mongoose');
const env = require("dotenv");
env.config({ path: 'config.env' });
const DB = process.env.DATABASE;

mongoose.set('strictQuery',false);
mongoose.connect(DB);
mongoose.connection.on('error', error => {
    console.log('Database Connection Failed' + error);
});

mongoose.connection.on('connected', connected => {
    console.log('Database Connected Successfully');
});