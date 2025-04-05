const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String,unique:true, required:true, validate: [validator.isEmail, 'Please enter a valid address']},
    password: {type: String, required: true},
    name: {type: String},
    profilePic: {type: String, default: "https://res.cloudinary.com/dnuqb888u/image/upload/v1742686168/bc7a0c399990de122f1b6e09d00e6c4c_vixq5b.jpg"},
    role: {type: String, enum: ["admin","user"], default:"user"},
    phone:{type: String, validate:[validator.isMobilePhone, 'Please eneter a valid phone number']},
    createdAt:{type: Date, required: true, default: Date.now},
    updatedAt: {type: Date, required: true, default: Date.now},
    team:{type: mongoose.Schema.Types.ObjectId,ref:'Team'},
    tournaments:[{type: mongoose.Schema.Types.ObjectId,ref:'Tournament'}]
    
})

module.exports = mongoose.model('User', userSchema);