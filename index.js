import express from "express";
import path from 'path';
import apiRoutes from './routes/authRoutes.js';
// import {register, login} from './controllers/authController.js'

const app = express();
const port = 3000;


app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.use('/',apiRoutes)

// app.get('/sample',register)

app.listen(port,()=>{
    console.log("Port is (re)started");
    
// console.log(path.dirname());  // Check the current directory of the script
// // console.log(path.basename()); 

// // Example of checking resolved path
// console.log(path.resolve(path.dirname(), '../controllers/authController'));

})
