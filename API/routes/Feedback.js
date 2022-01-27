const express = require('express');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const Feedback = require('../models/FeedbackModel');
const Member = require('../models/MemberModel');

//POST FEEDBACK 

Router.post('/create',async(req,res) => {
    try {
        let { member_id,feedback,status,createdby } = req.body;
        let member = await Member.findOne({
            _id: req.body.member_id
        });
        if(member){
            console.log(member,"Valied member");
            let feedbackItem =  new Feedback({
                member_id : member_id,
                feedback: feedback,
                status: status,
                createdby: createdby,
                createdon: new Date() 
            }).save((err,data)=>{
                if(!err){
                    console.log(data);
                    res.status(200).json({
                        statuscode: 200,
                        status: true,
                        message: "Feedback posted successfully",
                        token: jwt.sign({ feedback: data.feedback }, 'sphoenix')
                    })
                }
                else{
                    res.status(400).json({
                    statuscode: 400,
                    status: false,
                    message: "Failed to create feedback ,user not exists"
                })
              }
            })
        }
        else {
            console.log(member,"User not exist");
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: "Failed to create feedback ,user not exists"
            })

        }
    }
    catch(err){
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Failed to create feedback"
        })
    }
})

//UPDATE FEEDBACK STATUS 

Router.patch('/update',async(req,res)=> {
    try {
        let { feedback_id , status } = req.body;
        await Feedback.updateOne({ _id: feedback_id }, {
            $set: {
                status : status
            }
        }).then((response) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "feedback updated Successfully",
                token: jwt.sign({ feedback_id }, 'sphoenix')
            })
        }).catch((err) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: err.message
            });
        });

    }
    catch(err){
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Failed to update feedback"
        })
    }
})

//GET BY FEEDBACK ID 

Router.post('/view/id',async(req,res)=> {
    try {
        let { feedback_id } = req.body;
       let feedback = await Feedback.findOne({
           _id : feedback_id
       })
       if(feedback){
        res.status(200).json({
            statuscode: 200,
            status: true,
            token: jwt.sign({ feedback}, 'sphoenix')   
        })
       }
       else{
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Failed to get feeback,not exists"
        })
       }
    }
    catch(err){
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Failed to get feeback"
        })
    }
})

//GET FEEDBACK MY MEMBER ID 

Router.post('/view/member_id',async(req,res)=> {
    try {
        let { member_id } = req.body;
       let feedback = await Feedback.find({
           member_id : member_id
       })
       if(feedback){
        res.status(200).json({
            statuscode: 200,
            status: true,
            token: jwt.sign({ feedback}, 'sphoenix')   
        })
       }
       else{
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Failed to get feeback,not exists"
        })
       }
    }
    catch(err){
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Failed to get feeback"
        })
    }
})

//GET FEEDBACK BY DATE DURATION 

Router.post('/view/date',async(req,res)=> {
    try {
        let { from_date,to_date } = req.body;
        let feedback;
        if(from_date && to_date){
            feedback = await Feedback.find({
                createdon: {
                    $gte: new Date(from_date),
                    $lte: new Date(to_date)
                }
            })
        }
        else if(from_date || to_date) {
            let date = from_date || to_date;
            console.log(date);
            feedback = await Feedback.find({
                createdon: {
                    $eq: new Date(date)
                }
            })
        }
        if(feedback){
            res.status(200).json({
            statuscode: 200,
            status: true,
            token: jwt.sign({ feedback}, 'sphoenix')   
        })
       }
       else{
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Failed to get feeback,not exists"
        })
       }
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Failed to get feeback"
        })
    }
})

module.exports = Router;