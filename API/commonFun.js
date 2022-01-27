const Product = require('./models/ProductModel');
const express = require('express');

const incrementString = function incrementString(string) {
    var number = string.match(/\d+/) === null ? 0 : string.match(/\d+/)[0];
    var numberLength = number.length
    number = (parseInt(number) + 1).toString();

    while (number.length < numberLength) {
        number = "0" + number;
    }
    return string.replace(/[0-9]/g, '').concat(number);
}

const testFun = function TestFun() {
    return 'Hello World !';
}

const dateFormat = function DateFormat(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
}

const addHoursToDate = function addHoursToDate(date, hours) {
    return new Date(new Date(date).setHours(date.getHours() + hours));
}

const product_list = async function product_list(req, res) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var currentDay = days[d.getDay()];
    await Product.aggregate([{
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
                // 'offers.offerdaysetting': 0,
                'offers.createdon': 0,
                'offers.updatedon': 0,
                'offers.__v': 0,
                createdon: 0,
                updatedon: 0,
                __v: 0
            }
        }
    ]).exec(async(err, data) => {
        if (err) {
            res.status(400).json({
                status: false,
                statuscode: 400,
                message: err.message
            })
        } else {
            if (data.length != 0) {
                let offerLength = (data[0].offers === undefined) ? 0 : data[0].offers.length;
                return {
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
                    offers: (data[0].offers.length === 0) ? [] : data[0].offers[(offerLength - 1)]
                        // offers: data[0].offers
                }
            } else {
                let data = await Product.find({
                    createdon: 0,
                    updatedon: 0,
                    __v: 0
                })
                console.log(data);
                if (data)
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
                        offers: []
                    }

                else
                    return 'Product is Empty !!!.'
            }
        }
    })
}

module.exports = { incrementString, testFun, dateFormat, product_list, addHoursToDate }