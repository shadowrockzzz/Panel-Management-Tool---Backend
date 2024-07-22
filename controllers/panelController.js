import Slot from "../model/slot.js";
import User from "../model/user.js";

const getPanelData = async (req, res) => {
  const { userName, token } = req.query;

  if (!userName) {
    res.status(404).send("Unable to get the userName");
  }

  try {
    let data = await User.findOne({ userName: userName });

    if (!data) {
      res.status(404).send("Unable to find the specific member");
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(404).send("Unable to find the member in database");
  }
};

const getAllPanels = async (req, res) => {
  try {
    const panels = await User.find({});

    if (panels.length == 0) {
      res.status(404).send("No panels present");
    } else {
      res.status(200).send(panels);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Database Error");
  }
};

const panelFilter = async(req,res)=>{
  try{
    const data = req.query
    // console.log(data)
  const dateBandWidth = {}
  if(data.start){
    const start = new Date(data.start);
    const startDate1 = new Date(start.getFullYear(), start.getMonth(), start.getDate(),
    0,0,0)
    dateBandWidth.start = {$gte:startDate1}
    
  }
  if(data.end){
    const end = new Date(data.end)
    const endDate1 = new Date(end.getFullYear(), end.getMonth(), end.getDate(),
    23,59,59)
    dateBandWidth.end = {$lte:endDate1}
  }

  const slots = await Slot.find(dateBandWidth)
  const set = new Set()
  if(slots.length>=1){
    for (let item of slots){
      set.add(item.bookedBy)
    }
  }
  // console.log(slots)

  const promises = []

  const panelSet = new Set()
  set.forEach((item)=>{
    const promise = User.find({
      userName: {$eq:item}
    }).then((panel)=>{
      panelSet.add(panel[0])
      // console.log(panelSet)
    })
    promises.push(promise)
  })

  Promise.all(promises).then(()=>{
    const halfFilterArray = Array.from(panelSet)
    const resultArray = []
    for (let userPanel of halfFilterArray){
      let canbeAdded = true
      for (let item in data){
        if(item==="name"){
          if(userPanel.userName!=data[item]){
            canbeAdded = false
          }
        }
        else if(item==="band"){
          if(userPanel.band!=data[item]){
            canbeAdded = false
          }
        }
        else if(item==="accountName"){
          if(userPanel.accountName!=data[item]){
            canbeAdded = false
          } 
        }
        else if(item==="skillSet"){
          if(!userPanel.skillSet.toLowerCase().includes(data[item].toLowerCase())){
            canbeAdded = false
          }
        } 
      }
      if(canbeAdded){
        resultArray.push(userPanel)
      }
    }
    if(resultArray.length>0) res.status(200).send(resultArray)
    // console.log(resultArray)
    if(resultArray.length===0) res.status(200).send(resultArray)
  })
  }
  catch(err){
    console.error(err)
    res.status(500).send("Internal Error")
  }
  // console.log(set,panelSet)
}

export default { getPanelData, getAllPanels, panelFilter };
