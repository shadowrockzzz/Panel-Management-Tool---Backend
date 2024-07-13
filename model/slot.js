import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    start:{type:Date},
    end:{type:Date},
    status:{type:String},
    bookedBy:{type:String},
    comments:{type:String}
})




export default mongoose.model('Slots',slotSchema)