const express = require('express')
const route = require('../src/routes/route')
const mongoose = require('mongoose')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://blogGroup17:blogGroup17@cluster0.lbcnqhr.mongodb.net/group17Database",{
    useNewUrlParser: true
})
.then(() =>console.log("MongoDB is connected"))
.catch(err=>console.log(err))

app.use("/",route)

app.listen(3000,function(){
    console.log("Express app running on port 3000")
})
