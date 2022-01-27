// Third Party Modules
const express = require('express')
const Router = express.Router()
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// Datebase Models 
const User = require("../models/UserModel");
const Member = require("../models/MemberModel");

// User API's Start
Router.post('/login', async function(req, res) {
    let data = [];
    let token = crypto.randomBytes(128).toString('hex');
    var userdata = await User.findOne({ username: req.body.username, status: 1 });
    if (!userdata) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "Username doesn't Exist, Please Enter Vaild Username !"
        })
    }

    var vaildPsw = await bcrypt.compare(req.body.password, userdata.password);
    if (!vaildPsw) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "Password Not Valid, Please Enter Vaild Password  !"
        })
    }
    var memberdata = await Member.findOne({ user_id: userdata._id });

    data.push({
        "user_id": userdata._id,
        "member_id": memberdata._id,
        "address": memberdata.address,
        "name": memberdata.name,
        "email": memberdata.email,
        "mobile": memberdata.mobile,
        "status": memberdata.status,
        "accesstoken": token
    })
    await User.updateOne({ _id: userdata._id }, {
            $set: {
                accesstoken: token,
                updatedon: new Date(),
                updatedby: userdata._id
            }
        })
        .catch((er) => {
            return res.status(400).json({
                status: true,
                statuscode: 200,
                message: "User Can't Update. Please Try Again !!"
            })
        })

    res.status(200).json({
        statuscode: 200,
        status: true,
        message: "Login Successfully",
        token: jwt.sign({ data }, 'sphoenix')
    })
});

Router.post('/user', async function(req, res) {
    let user_details = {};
    user_details.name = req.body.name;
    user_details.mobile = req.body.mobile;
    user_details.email = req.body.email;
    user_details.address1 = req.body.address1;
    user_details.address2 = req.body.address2;
    user_details.city = req.body.city;
    user_details.state = req.body.state;
    user_details.country = req.body.country;
    user_details.username = req.body.username;
    user_details.password = await bcrypt.hash(req.body.password, 10);
    user_details.og_password = req.body.password;
    user_details.createdon = new Date();
    user_details.updatedon = null;
    user_details.status = 1;

    let userDetails = new User(user_details);
    await userDetails.save(function(err, data) {
        if (err) {
            res.status(409).json({
                statuscode: 409,
                status: false,
                message: "Something went wrong"
            })
        } else {
            var id = data._id
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "User Created Successfully",
                token: jwt.sign({ id }, 'sphoenix'),
            })
        }
    })
})

Router.put('/logout', async(req, res) => {
    let userDetails = await Member.findById(req.body.memberid);

    await User.updateOne({ _id: userDetails.user_id }, {
        $set: {
            "is_online": 0,
            "updatedon": new Date(),
            "updatedby": req.body.memberid,
        }
    }).then((response) => {
        res.status(200).json({
            status: true,
            statuscode: 200,
            message: 'Logout Success !!!'
        })
    }).catch((err) => {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: err.message
        });
    });
})

module.exports = Router;