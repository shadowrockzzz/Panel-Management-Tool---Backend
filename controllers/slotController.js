import Slot from "../model/slot.js";

const addSlot = async(req,res)=>{
    try {
        const slotVariables = req.body
        const slot = new Slot(slotVariables)
        await slot.save()
        res.status(200).send("Saved into DB")
    }
    catch(err){
        console.error(err)
        res.status(500).send("Internal Database Error")
    }

}

const updateSlots = async(req,res)=>{
    try{
        const slot = req.body
        const id = slot.id
        delete slot.id
        Slot.findByIdAndUpdate(id, slot,{new: true}).then((data)=>{
            res.status(200).send(data)
        })
    }
    catch(err){
        console.error(err)
        res.status(500).send("Updated function went wrong")
    }
}

const getSlotsByPanel = async(req,res)=>{
    try{
        const {startDate, userName} = req.query
        const start = new Date(startDate);
        const startDateInUTC = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(),
        start.getHours(), start.getMinutes(),start.getSeconds()))
        const slots = await Slot.find({
            start: {$gte: startDateInUTC},
            bookedBy: {$eq: userName}
        })
        if(slots){
            res.status(200).send(slots)
        }
        else {
            res.status(404).send("No slots available in the given period")
        }
    }catch(err){
        console.error(err)
        res.status(500).send("Internal Error")
    } 
}


const getSlots = async(req,res)=>{
    const {startDate, endDate} = req.query

    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDateInUTC = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(),
    0, 0,0))

    const endDateInUTC = new Date (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(),
    0,0, 0))

    try{
        let slots = await Slot.find({
            start: {$gte: startDateInUTC},
            end:{$lt: endDateInUTC}
        })
        if(slots.length>0){
            res.status(200).send(slots)
        }
        else if(slots.length==0){
            res.status(404).send("No slots available")
        }
    }
    catch(err){
        res.status(500).send("Unknown Error")
        console.error(err)
    }
    
}

const deleteSlot = async(req,res)=>{
    try{
        const id = req.params.id
        Slot.findByIdAndDelete(id).then((data)=>{
            console.log(data)
            res.status(200).send("Successfully deleted the slot")
        })
    }catch(err){
        console.error(err)
        res.status(500).send("Internal Error")
    }
}

export default {updateSlots,getSlots,addSlot, getSlotsByPanel, deleteSlot}