const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT;
const app = express();
require('./database/connection');
app.use(express.json());
app.use(require('./router/auth'));
const User = require('./model/userSchema');

app.listen(PORT, () => {
  console.log('server up at localhost', PORT);
});