// Third Party Module
const express = require('express')
const jwt = require('jsonwebtoken')
const Router = express.Router()

const common = require('../commonFun');
const OfferModel = require('../models/OfferModel');

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
    await orderData.save((err, data) => {
        if (err) {
            res.status(400).json({
                status: false,
                statuscode: 400,
                token: 'Something went wrong !. Your Order Can`t be Placed !'
            })
        } else {
            res.status(200).json({
                status: true,
                statuscode: 200,
                token: jwt.sign({ orderDeatails }, 'sphoenix')
            })
        }
    })
})

Router.post('/orderstatus', async(req, res) => {
    let { memberid, orderid, status } = req.body;

    res.status(200).json({
        statuscode: 200,
        status: true,
        token: jwt.sign({ data }, 'sphoenix')
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

module.exports = Router;