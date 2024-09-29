import Slot from "../model/slot.js";
import user from "../model/user.js";
import User from "../model/user.js";

import fs from 'fs';
import xlsx from 'xlsx';

const getPanelData = async (req, res) => {
  const { empId, token } = req.query;

  if (!empId) {
    res.status(404).send("Unable to get the userName");
  }

  try {
    let data = await User.findOne({ EmpId: empId });

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

const getAllTAs = async(req,res)=>{
  try{
    const TAs = await User.find({
      role: {$eq: 'TA'}
    })

    if (TAs.length==0){
      res.status(404).send("No TA's exist");
    }
    else{
      res.status(200).send(TAs);
    }
  } catch(err){
    res.status(500).send("Internal Database Error");
  }
}

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
      EmpId: {$eq:item}
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

const getUploadedList = async(req,res)=>{
  if (req.file){
    fs.readFile('Uploads/'+req.file.originalname,(err,data)=>{
    if(err){
      console.error(err)
      return
    }
    const filepath = 'Uploads/'+req.file.originalname
    const workBook = xlsx.readFile(filepath)
    const firstSheetName = workBook.SheetNames[0]
    const sheet = workBook.Sheets[firstSheetName]
    const data1 = xlsx.utils.sheet_to_json(sheet)
    data1.forEach((panel)=>{
      if(panel._id){
        delete panel._id
      }
      if (panel.__v){
        delete panel.__v
      }
      const user = new User({
        userName: panel.userName,
        password: panel.password,
        role:panel.role,
        band:panel.band,
        skillSet: panel.skillSet,
        emailId: panel.emailId,
        ICPCertified: panel.ICPCertified,
        city: panel.city,
        accountName: panel.accountName,
        subPractice: panel.subPractice,
        band: panel.band,
        EmpId: panel.empId,
        sector: panel.sector,
        location: panel.location,
        contactNumber: panel.contactNumber,
        practice: panel.practice,
        level: panel.level
      })
        // const salt = await bcrypt.genSalt(10)
        // user.password = await bcrypt.hash(password, salt)
       user.save()
    })

  })
  res.status(201).send({data: "Uploaded the file"})
  }
else{
  res.status(415).send("Unsuccessfull upload. Please try again with correct file.")
}
}

export default { getPanelData, getAllPanels, panelFilter, getUploadedList, getAllTAs };
