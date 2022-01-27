// Third Party Module
const express = require('express')
const jwt = require('jsonwebtoken');
const { authorization } = require('../middleware/auth.js');
const Router = express.Router()

const common = require('../commonFun');
const OfferModel = require('../models/OfferModel');
const Member = require('../models/MemberModel');
const ShopingCart = require('../models/CartModel');
// Database Modal
const Order = require('../models/OrderModel');

Router.post('/order', async(req, res) => {
    let orderDeatails = req.body

    let orderCode = await Order.findOne({ status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 }).sort({ createdon: -1 });

    orderDeatails.code = (orderCode === null) ? 'SPOR_00001' : common.incrementString(orderCode.code);
    orderDeatails.createdon = new Date();
    orderDeatails.createdby = orderDeatails.member_id;
    orderDeatails.updatedon = null;
    orderDeatails.updatedby = null;
    orderDeatails.status = 1;

    let orderData = new Order(orderDeatails)
    await orderData.save(async(err, data) => {
        if (err) {
            res.status(400).json({
                status: false,
                statuscode: 400,
                token: 'Something went wrong !. Your Order Can`t be Placed !'
            })
        } else {
            var myquery = { member_id: orderDeatails.member_id };
            ShopingCart.deleteOne(myquery, function(err, obj) {
                if (err) throw err;
            });
            await Order.find({}).sort({_id:-1}).limit(1).then(orderData => { 
                res.status(200).json({
                    status: true,
                    statuscode: 200,
                    token: jwt.sign({ orderData }, 'sphoenix')
                })
            });
            
        }
    })
})
Router.post('/list_order', async(req, res) => {
        if (req.body.member_id !== '') {
            if(req.body.order_id !== ''){
                let Orderdata = await Order.findById(req.body.order_id).then(orderData => {
                    if (orderData) {
                        res.status(200).json({
                            status: true,
                            statuscode: 200,
                            data: orderData,
                            token: jwt.sign({ orderData }, 'sphoenix')
                        })
                    } else {
                        res.status(200).json({
                            status: false,
                            statuscode: 200,
                            message: 'Order Empty !'
                        })
                    }

                }).catch(err => {
                    res.status(400).json({
                        status: false,
                        statuscode: 200,
                        message: 'Member id not found'
                    })

                })
            }else{
                let Orderdata = await Order.find({"member_id":req.body.member_id}).then(orderData => {
                    if (orderData) {
                        res.status(200).json({
                            status: true,
                            statuscode: 200,
                            data: orderData,
                            token: jwt.sign({ orderData }, 'sphoenix')
                        })
                    } else {
                        res.status(200).json({
                            status: false,
                            statuscode: 200,
                            message: 'Order Empty !'
                        })
                    }

                }).catch(err => {
                    res.status(400).json({
                        status: false,
                        statuscode: 200,
                        message: 'Member id not found'
                    })

                })
            }
            
        } else {
            res.status(200).json({
                status: false,
                statuscode: 200,
                message: 'Member Id Mandatory !'
            })
        }
    })

Router.post('/orderstatus', async(req, res) => {
    let { member_id, orderid, order_status } = req.body;

    let orderData = await Order.findById(orderid);
    let memberData = await Member.findById(member_id);
    let historyDetails = req.body;

    historyDetails.order_status = order_status
    historyDetails.description = 'Order Updated';
    historyDetails.name = memberData.name;
    historyDetails.mode = 1;
    historyDetails.createdon = new Date();
    historyDetails.createdby = member_id;
    await Order.updateOne({ _id: orderid }, {
        $set: {
            order_history: [...orderData.order_history, historyDetails],
            order_status:order_status,
            updatedon: new Date(),
            updatedby: member_id
        }
    })
    let orderDatan = await Order.findById(orderid);  
    res.status(200).json({
        statuscode: 200,
        status: true,
        token: jwt.sign({ orderDatan }, 'sphoenix')
    })
})

Router.post('/couponapply', async(req, res) => {
    let { member_id, offercode } = req.body;
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var currentDay = days[d.getDay()];

    let offerDetials = await OfferModel.findOne({
        offercode: offercode,
        $or: [
            { offerdaysetting: { $elemMatch: { label: { $in: [currentDay] } } } },
            { validitytype: 1 },
            { validitytype: { $eq: 2 }, validitydate: { $gte: d } }
        ]
    })

    if (offerDetials) {
        await Order.aggregate([{
                $addFields: {
                    "offer_id": {
                        $toObjectId: "$offer_id"
                    }
                }
            },
            {
                $lookup: {
                    from: 'ma_offer',
                    localField: "_id",
                    foreignField: "offer_id",
                    as: 'offers',
                }
            },
            {
                $match: {
                    $or: [{
                        member_id: member_id,
                        order_status: { $nin: [2, 3, 10, 11] },
                        $or: [
                            { 'ma_offer.offertype': { $eq: 1 }, 'ma_order.createdon': { $eq: common.addHoursToDate(d, 2) } }
                        ]
                    }]
                }
            },
            {
                $sort: { createdon: -1 }
            },
            {
                $limit: 1
            }
        ]).exec(async(err, data) => {
            if (err) {
                res.status(400).json({
                    statuscode: 400,
                    status: false,
                    message: 'Something went wrong !.' + err.message
                })
            }

            if (data.length >= 0) {
                res.status(200).json({
                    statuscode: 200,
                    status: false,
                    token: jwt.sign({ data }, 'sphoenix')
                })
            } else {
                res.status(200).json({
                    statuscode: 200,
                    status: false,
                    message: 'Offer Code not Valid (or) Invalid Offer !!!.'
                })
            }
        })
    } else {
        res.status(200).json({
            statuscode: 200,
            status: false,
            message: 'Offer Code not Valid (or) Invalid Offer !!!.'
        })
    }
})

Router.post('/order_list', authorization, async(req, res) => {
    try {
        let memberId = req.body.memberId;
        let member = await Member.find({
            _id: memberId,
            user_id: res.userId
        })
        if (member) {
            let data = await Order.find({
                member_id: res.memberId
            })
            console.log(data);
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: 'Order list get successfully',
                token: jwt.sign({ data }, 'sphoenix')
            })
        }
    } catch (err) {
        res.status(401).json({
            statuscode: 401,
            status: false,
            message: 'Failed to get order details'
        })
    }
})

module.exports = Router;