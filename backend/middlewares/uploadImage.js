const multer = require('multer');
const cloudinary =require('../config/cloudinary');
const fs = require('fs');

//Cau hinh Multer de luu file tam vao thu muc 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads/"); //Thu muc tam
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + "-" + file.originalname);
    },
})

const upload = multer({storage}).single('image');

module.exports = upload;

