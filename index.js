import express from "express";
import apiRoutes from './routes/authRoutes.js';
// import User from './model/user.js'
import user from "./model/user.js";
import mongoose from 'mongoose';
import config from "./config/config.js";
import cors from 'cors';
// import {register, login} from './controllers/authController.js'

const app = express();
const port = 3000;


app.use(cors())
app.use(express.json())

mongoose.connect(config.database.uri,config.database.options).then(()=>{
    console.log("Connection to MongoDB database has been started")
}).catch((err)=>{
    console.error(err);
})

app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.use('/',apiRoutes)

// app.get('/sample',register)

app.get('/register', (req, res) => {
    // const user1 = new user({
    //     userName: "Sai",
    //     password: "random"
    // });

    // user1.save()
    //     .then(() => {
    //         res.status(200).send("User registered successfully");
    //     })
    //     .catch(err => {
    //         res.status(500).send("Error registering user: " + err.message);
    //     });
    res.status(200).send("This port is working!!!")
});

app.get('/panel',(req,res)=>{
    user.find({}).then((data)=>{
        console.log(data)
        res.send(data)
    }).then(()=>{
        // res.send("Consoled the data")
    })
})


process.on('SIGINT',async()=>{
    try{
        await mongoose.disconnect()
        console.log("MongoDB disconnected")
        process.exit(0)
    }
    catch(err){
        console.error(err)
        process.exit(0)
    }
})

app.listen(port,()=>{
    console.log("Port is (re)started");
    
// console.log(path.dirname());  // Check the current directory of the script
// // console.log(path.basename()); 

// // Example of checking resolved path
// console.log(path.resolve(path.dirname(), '../controllers/authController'));

})
