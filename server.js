const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db');

//DOTENV
dotenv.config();

//MONGO DB CONNECTION
connectDB();

//REST Object
const app = express();

//mongoose.connect('mongodb//localhost:27017')
//Middlwares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//ROUTES
app.use("/api/v1/auth", require("./routes/userRoutes"))
app.use("/api/v1/post", require("./routes/postRoutes"))

//Home
app.get("/", (req,res)=>{
    res.status(200).send({
        "success": true,
        "msg":"Servirdor Node rodando"

//PORT
const PORT = process.env.PORT || 8085

//Listen
app.listen(PORT, ()=>{
    console.log(`Server sendo executado! ${PORT}`.bgGreen.white)
});

