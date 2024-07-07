import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../model/user.js'
// import {registerUser, loginUser} from '../services/authservice'

const register = async (req,res)=>{
    const {userName, password} = req.body;

    try{
        let user = User.findOne({userName})
        if(user) {
            return res.status(400).json({message: "User already exists"});
        }
        user = new User({userName, password})
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        res.status(201).json({message: "User sucessfully registered"});
    }
    catch(err) {
        res.status(500).json({message:"There is a server issue. Wait for us to resolve the same"});
    }
}

const login = async (req,res)=>{
    // console.log(req.query)
    const {userName, password} = req.query;

    try{
        let user = await User.findOne({userName})
    if(!user){
        res.status(404).json({message:"Invalid Credentials"})
    }
    
    // const isMatch = await bcrypt.compare(password, user.password)
    const isMatch = (password===user.password) ? true : false;

    if(!isMatch){
        res.status(404).json({message: "Invalid Credentials"})
    }
    
    const payload= {authorized: true}

    jsonwebtoken.sign(payload, config.tokens.jwtSecret, {expiresIn: config.tokens.jwtExpiration}, (err,token)=>{
        if(err){
            throw err;
        }
        res.json({token})
    })
    }
    catch(err){
        console.error(err)
        res.send(500).json({message:"Database Issue"})
    }


}

export default {register,login}