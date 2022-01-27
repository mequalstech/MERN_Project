const express = require('express');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const client = require('twilio')(process.env.accountSid, process.env.authToken);
const common = require('../commonFun');
const { pagination } = require('../middleware/shared');

// DATABASE
const Banner = require("../models/BannerModel");
const Category = require("../models/CategoryModel");
const SubCategory = require('../models/SubCategoryModel');
const Product = require('../models/ProductModel');
// const Offer = require('../models/OfferModel');

// Routings
Router.get('/home', async(req, res) => {
    let banner = await Banner.find({ status: 1 }, { createdon: 0, updatedon: 0, __v: 0 });
    let category = await Category.find({ status: 1 }, { createdon: 0, updatedon: 0, __v: 0 });

    // let product = await Product.find({ status: 1 })

    // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // var d = new Date();
    // var currentDay = days[d.getDay()];

    // let deals = await Offer.findOne({ 'offerdaysetting.label': currentDay })

    res.status(200).json({
        statuscode: 200,
        status: true,
        token: jwt.sign({
            data: {
                banner,
                category
            }
        }, 'sphoenix')
    })
})

Router.post('/search', pagination, async(req, res) => {
    let limit = parseInt(req.body.limit);
    let page = parseInt(req.body.page);
    let { key } = req.body;

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var currentDay = days[d.getDay()];
    let productList = await Product.aggregate([{
            $addFields: {
                "_id": {
                    $toString: "$_id"
                }
            }
        },
        {
            $lookup: {
                from: 'ma_offer',
                localField: "_id",
                foreignField: "product.value",
                as: 'offers',
            }
        },
        {
            $match: {
                "name": { $regex: key, $options: "i" },
                $or: [
                    { 'offers.offerdaysetting': { $elemMatch: { label: { $in: [currentDay] } } } },
                    { 'offers.validitytype': 1 },
                    { 'offers.validitytype': { $eq: 2 }, 'offers.validitydate': { $gte: d } }
                ]
            }
        },
        {
            $project: {
                'offers.product': 0,
                'offers.category': 0,
                'offers.partner': 0,
                'offers.createdon': 0,
                'offers.updatedon': 0,
                'offers.__v': 0,
                createdon: 0,
                updatedon: 0,
                __v: 0
            }
        }
    ]).exec(async(err, data) => {
        console.log(data.length);
        data = data.slice(res.startIndex, res.endIndex);
        console.log(data.length);
        if (err) {
            res.status(400).json({
                status: false,
                statuscode: 400,
                message: err.message
            })
        } else {
            if (data.length != 0) {
                let pro_data = data.map((data, index) => {
                    let offerLength = (data.offers === undefined) ? 0 : data.offers.length;
                    return {
                        _id: data._id,
                        name: data.name,
                        description: data.description,
                        type: data.type,
                        price: data.price,
                        packing_cost: data.packing_cost,
                        tax: data.tax,
                        taxvalue: data.taxvalue,
                        totalprice: data.totalprice,
                        min_qty: data.min_qty,
                        unit: data.unit,
                        is_inventory: data.is_inventory,
                        status: data.status,
                        tracking: data.tracking,
                        minstock: data.minstock,
                        category: data.category,
                        subcategory: data.subcategory,
                        images: data.images,
                        variant: data.variant,
                        offers: (data.offers.length === 0) ? [] : [data.offers[(offerLength - 1)]]
                    }
                })
                return res.status(200).json({
                    status: true,
                    statuscode: 200,
                    token: jwt.sign({
                        data: pro_data
                    }, 'sphoenix')
                })
            } else {
                let data = await Product.findOne({ name: { $regex: key, $options: "i" } }, {
                    createdon: 0,
                    updatedon: 0,
                    __v: 0
                })

                if (data) {
                    let pro_data = [];
                    if (data[0] != undefined) {
                        pro_data = [{
                            _id: data[0]._id,
                            name: data[0].name,
                            description: data[0].description,
                            type: data[0].type,
                            price: data[0].price,
                            packing_cost: data[0].packing_cost,
                            tax: data[0].tax,
                            taxvalue: data[0].taxvalue,
                            totalprice: data[0].totalprice,
                            min_qty: data[0].min_qty,
                            unit: data[0].unit,
                            is_inventory: data[0].is_inventory,
                            status: data[0].status,
                            tracking: data[0].tracking,
                            minstock: data[0].minstock,
                            category: data[0].category,
                            subcategory: data[0].subcategory,
                            images: data[0].images,
                            variant: data[0].variant,
                            offers: []
                        }];
                    }
                    return res.status(200).json({
                        statuscode: 200,
                        status: true,
                        token: jwt.sign({
                            data: pro_data
                        }, 'sphoenix')
                    })
                } else {
                    let categoryData = await Category.find({ status: 1, category: key }, { createdon: 0, updatedon: 0, __v: 0 }).limit(limit * 1).skip((page - 1) * limit);
                    let subcategoryData = await SubCategory.find({ status: 1, subcategory: key }, { createdon: 0, updatedon: 0, __v: 0 }).limit(limit * 1).skip((page - 1) * limit);

                    if ((categoryData.length > 0) || (subcategoryData.length > 0)) {
                        return res.status(200).json({
                            status: true,
                            statuscode: 200,
                            token: jwt.sign({ categoryData, subcategoryData }, 'sphoenix')
                        })
                    } else {
                        return res.status(400).json({
                            status: true,
                            statuscode: 400,
                            message: "Key Value Doesn't Match Products and Categorys or Subcategorys !. Enter Valid Key use to Search"
                        })
                    }
                }
            }
        }
    })
})

Router.post('/whatsapp', async(req, res) => {
    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+91' + req.body.mobile,
            body: req.body.message
        })
        .then(result => {
            res.status(200).json({
                message: result
            })
        })
        .catch((e) => {
            res.status(400).json({
                message: e.message
            })
        })
})

module.exports = Router;