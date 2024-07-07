import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../model/user.js'

const getPanelData = async (req,res)=>{
    const {userName, token} = req.query;

    if(!userName){
        res.status(404).send("Unable to get the userName")
    }

    try{
        let data = await User.findOne({userName:userName})

        if(!data){
            res.status(404).send("Unable to find the specific member")
        }

        res.json(data)

    }
    catch(error){
        console.error(error)
        res.status(404).send("Unable to find the member in database")
    }

}

export default {getPanelData}