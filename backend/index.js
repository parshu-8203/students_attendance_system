const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes/index');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const port = 5000;


app.use(express.json())
app.use(cors())
dotenv.config()

connectDB();

app.use('/', routes);



app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});