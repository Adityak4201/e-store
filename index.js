const express = require('express');
const mongoose = require('mongoose');
// const auth = require('./middleware/auth');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const port = 3000;
const app = express();
app.use(cookieParser())
app.use(cors());





mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/magi2', {useNewUrlParser: true, useCreateIndex: true,
useUnifiedTopology: true, useFindAndModify: false});

const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("I'm connected");
});




app.use("/uploads", express.static("uploads"));
app.use(express.static("uploads"))
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.json({Status: "Server running"});
});

const userrouter = require('./routes/user')
const profilerouter = require('./routes/profile')
const sellerrouter = require('./routes/sellerprofile')
const product = require('./routes/product')

app.use('/user', userrouter);
app.use('/profile',profilerouter);
app.use('/sellerprofile',sellerrouter);
app.use('/products',product);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(port, ()=>{
    console.log(`connected to the port ${port}`);
});
