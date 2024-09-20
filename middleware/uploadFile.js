import multer from "multer";

const storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,'Uploads')
    },
    filename: (req,file,callback)=>{
        callback(null,file.originalname)
    }
})

const fileFilter = (req,file,callback)=>{
    if (file.mimetype==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        callback(null,true)
    }
    else{
        callback(null,false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

export default upload

