const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Profile = Schema({

    profileimg:{
        type: String,
        default:""
    },
    username:{
        type: String
    },
    address:{
        type: String
    },
    about:{
        type: String
    },
    dob:{
        type: Date
    },

    cart:{ type : Array , "default" : [] },
    items:{ type : Array , "default" : [] },
    noti:{ type : Array , "default" : [] },

})


module.exports=mongoose.model("Profile",Profile);
