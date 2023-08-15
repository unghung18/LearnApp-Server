const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const route = require('./routes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser());


// Connect Db
const connectDb = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log('Database connection succesfully')
    } catch (error) {
        console.log(error)
        console.log('Connect Failure!!!!!');
    }
}
connectDb();

route(app);

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log('Server is running....');
})