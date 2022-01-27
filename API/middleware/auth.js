const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const authorization = async(req,res,next) =>{
    if(req.body.accessToken){
      let user = await User.findOne({
        accesstoken: req.body.accessToken,
      })
      if(user){
        console.log("Authorization Success");
        res.memberId = req.body.memberId;
        res.userId = user._id;
        next();
      }
      else {
        console.log("Authorization Failed");
        res.status(400).json({
          statuscode: 400,
          status: false,
          message: "Authorization Failed"
      })
      }
    }  
}
 
module.exports = { authorization };