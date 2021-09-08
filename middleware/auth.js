const jwt = require('jsonwebtoken');
const Register = require('../models/userModel');
const config = require('../config')

const auth = async (req,res,next)=>{
    try {
        const token = req.header('x-auth-token')
        // console.log("x-auth-token", token);
        const verifyuser = jwt.verify(token,config.key)
        console.log("roll", verifyuser.roll , "id", verifyuser._id );

        const user = await Register.findOne({_id:verifyuser._id , roll :verifyuser.roll}).select("-password")
        
        req.token = token;
        req.user = user;
        if(user != null){
            next();
        }else{
            res.status(401).send("no such user");
        }
        
    } catch (error) {
        res.status(401).send(error)
        console.log(error)
    }
}
module.exports = auth;
