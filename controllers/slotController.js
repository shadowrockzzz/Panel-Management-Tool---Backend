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
        const {startDate, userId} = req.query
        const start = new Date(startDate);
        const startDate1 = new Date(start.getFullYear(), start.getMonth(), start.getDate(),
        start.getHours(), start.getMinutes(),start.getSeconds())
        const slots = await Slot.find({
            start: {$gte: startDate1},
            bookedBy: {$eq: userId}
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

const getSlotsByPanelAndDates = async(req,res)=>{
    try{
        const {startDate, endDate, userId} = req.query
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startDate1 = new Date(start.getFullYear(), start.getMonth(), start.getDate(),
        0, 0,0)
        const endDate1 = new Date(end.getFullYear(), end.getMonth(), end.getDate(),
        23, 59,59)
        const slots1 = await Slot.find({
            start: {$gte: startDate1},
            end:{$lte:endDate1},
            bookedBy: {$eq: userId}
        })
        const assingendSlots = await Slot.find({
            start: {$gte: startDate1},
            end:{$lte:endDate1},
            AssignedTAID: {$eq:userId}
        })
        const slots = [...slots1,...assingendSlots]
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

    const startDate1 = new Date(start.getFullYear(), start.getMonth(), start.getDate(),
    0, 0,0)

    const endDate1 = new Date (end.getFullYear(), end.getMonth(), end.getDate(),
    23,59,59)

    try{
        let slots = await Slot.find({
            start: {$gte: startDate1},
            end:{$lt: endDate1}
        })
        if(slots.length>0){
            res.status(200).send(slots)
        }
        else if(slots.length==0){
            res.status(200).send({})
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
            res.status(200).send("Successfully deleted the slot")
        })
    }catch(err){
        console.error(err)
        res.status(500).send("Internal Error")
    }
}

export default {updateSlots,getSlots,addSlot, getSlotsByPanel, deleteSlot, getSlotsByPanelAndDates}