// Third Party Modules
const express = require('express')
const Router = express.Router()
var jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const common = require('../commonFun');

var banner_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var appDir = path.dirname(require.main.filename);
        appDir = appDir.slice(0, -3);
        var paths = appDir + process.env.IMAGE_DIR + '/banner/';
        if (!fs.existsSync(paths)) {
            fs.mkdir(paths, { recursive: true }, err => { })
        }
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var offer_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var appDir = path.dirname(require.main.filename);
        appDir = appDir.slice(0, -3);
        var paths = appDir + process.env.IMAGE_DIR + '/offer/';
        if (!fs.existsSync(paths)) {
            fs.mkdir(paths, { recursive: true }, err => { })
        }
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var banner_upload = multer({ storage: banner_storage })
var offer_upload = multer({ storage: offer_storage })

// Datebase Models
const Banner = require("../models/BannerModel");
const Offer = require("../models/OfferModel");
const GST = require('../models/GstModel');
const Product = require('../models/ProductModel');

// Banner API's Start
Router.post('/banner', banner_upload.single('file'), async function (req, res) {
    let banner_details = req.body;
    if (req.file) {
        banner_details.image = process.env.IMAGE_URL+'/banner/'+req.file.originalname;
    }
    banner_details.createdon = new Date();
    banner_details.updatedon = null;
    banner_details.status = 1;

    let bannerDetails = new Banner(banner_details);
    await bannerDetails.save(function (err, data) {
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
                message: "Banner Created Successfully",
                token: jwt.sign({ id }, 'sphoenix'),
            })
        }
    })
})

Router.post('/banner_exist', async (req, res) => {
    var data = await Banner.findOne({ title: req.body.title, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 });
    if (data) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This Banner Title Already Exist, Please Try Again !"
        })
    }
    else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Banner Tittle !"
        })
    }
})

Router.put('/banner_exist/:id', async (req, res) => {
    var data = await Banner.find({ title: req.body.title, _id: { $ne: req.body.id }, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 });
    if (data.length != 0) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This Banner Title Already Exist, Please Try Again !"
        })
    }
    else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Banner Tittle !"
        })
    }
})

Router.put('/banner_sequence/:id', async function (req, res) {
    const id = req.params.id;
    let banner_details = req.body;
    if (req.body.sequence) {
        var seq_data = await Banner.findOne({ sequence: req.body.sequence, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 });
        if (seq_data) {
            res.status(200).json({
                status: false,
                statuscode: 200,
                message: "Sequence no doesn't Exist, Please try again !"
            })
        }
        else {
            await Banner.updateOne({ _id: id }, {
                $set: banner_details
            }).then((response) => {
                res.status(200).json({
                    statuscode: 200,
                    status: true,
                    message: "Banner Sequence Successfully",
                    token: jwt.sign({ id }, 'sphoenix')
                })
            }).catch((err) => {
                res.status(400).json({
                    statuscode: 400,
                    status: false,
                    message: err.message
                });
            });
        }
    }
    else {
        res.status(200).json({
            status: false,
            statuscode: 200,
            message: "Please Enter Sequance No !"
        })
    }
})

Router.put('/banner_size/:id', async function (req, res) {
    const id = req.params.id;
    let banner_details = req.body;
    if (req.body.size) {
        var size_data = await Banner.findOne({ size: req.body.size, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 });
        if (size_data) {
            res.status(200).json({
                status: false,
                statuscode: 200,
                message: "Size doesn't Exist, Please try again !"
            })
        }
        else {
            await Banner.updateOne({ _id: id }, {
                $set: banner_details
            }).then((response) => {
                res.status(200).json({
                    statuscode: 200,
                    status: true,
                    message: "Banner Size Successfully",
                    token: jwt.sign({ id }, 'sphoenix')
                })
            }).catch((err) => {
                res.status(400).json({
                    statuscode: 400,
                    status: false,
                    message: err.message
                });
            });
        }
    }
    else {
        res.status(200).json({
            status: false,
            statuscode: 200,
            message: "Please Enter Size !"
        })
    }
})

Router.put('/banner/:id', banner_upload.single('file'), async function (req, res) {
    const id = req.params.id;
    let banner_details = req.body;

    if (req.file) {
        banner_details.image = process.env.IMAGE_URL+'/banner/'+req.file.originalname;
    }
    if (banner_details.mode === 'null') {
        banner_details.mode = 0
    }

    console.log(banner_details);
    banner_details.updatedon = new Date();

    await Banner.updateOne({ _id: id }, {
        $set: banner_details
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Banner Updated Successfully",
            token: jwt.sign({ id }, 'sphoenix')
        })
    }).catch((err) => {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: err.message
        });
    });
})

Router.get('/banner', async function (req, res) {
    await Banner.find({ status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All Banner List",
                token: jwt.sign({ data }, 'sphoenix')
            })
        }).catch((err) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: err.message
            });
        });
})

Router.get('/banner/:id', async function (req, res) {
    const id = req.params.id;
    await Banner.find({ _id: id, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All Banner List By ID",
                token: jwt.sign({ data }, 'sphoenix')
            })
        }).catch((err) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: err.message
            });
        });
})

Router.put('/banner_delete/:id', async function (req, res) {
    const id = req.params.id;
    await Banner.updateOne({ _id: id }, {
        $set: {
            status: 3,
            updatedon: new Date(),
        }
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Banner Deleted Successfully",
            token: jwt.sign({ id }, 'sphoenix')
        })
    }).catch((err) => {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: err.message
        });
    });
})

Router.post('/banner_action', async function (req, res) {
    var id = req.body.ids;
    var type = req.body.type;

    // for (let i = 0; i < id.length; i++) {
    await Banner.updateMany({ status: { $in: [1, 2] }, _id: { $in: id } }, {
        $set: {
            status: (type === 'active' ? 1 : (type === 'inactive' ? 2 : (type === 'delete' ? 3 : ''))),
            updatedon: new Date(),
        }
    }).then((resp) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Banner " + (type === 'active' ? 'Active' : (type === 'inactive' ? 'In Active' : (type === 'delete' ? 'Delete' : ''))) + " Successfully !",
        })
    }).catch((resp) => {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Something went wrong ! Please Try Again !",
        })
    })
    // }
})
// Banner API's End

// Offer API's Start
Router.post('/offer', offer_upload.single('file'), async function (req, res) {
    let offer_details = req.body;

    if (req.file) {
        offer_details.image = process.env.IMAGE_URL+'/offer/'+req.file.originalname;
    }

    offer_details.offerdaysetting = JSON.parse(offer_details.offerdaysetting);
    offer_details.partner = JSON.parse(offer_details.partner);
    offer_details.category = JSON.parse(offer_details.category);
    offer_details.product = JSON.parse(offer_details.product);

    offer_details.createdon = new Date();
    offer_details.updatedon = null;
    offer_details.status = 1;

    let offerDetails = new Offer(offer_details);
    await offerDetails.save(function (err, data) {
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
                message: "Offer Created Successfully",
                token: jwt.sign({ id }, 'sphoenix'),
            })
        }
    })
})

Router.post('/offer_exist', async (req, res) => {
    var data = await Offer.findOne({ offertitle: req.body.title, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 });
    if (data) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This Offer Already Exist, Please Try Again !"
        })
    }
    else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Offer !"
        })
    }
})

Router.put('/offer_exist/:id', async (req, res) => {
    var data = await Offer.find({ offertitle: req.body.title, _id: { $ne: req.body.id }, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 });
    if (data.length != 0) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This Offer Already Exist, Please Try Again !"
        })
    }
    else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Offer Tittle !"
        })
    }
})

Router.put('/offer/:id', offer_upload.single('file'), async function (req, res) {
    const id = req.params.id;
    let offer_details = req.body;

    if (req.file) {
        offer_details.image = process.env.IMAGE_URL+'/offer/'+req.file.originalname;
    }

    offer_details.offerdaysetting = JSON.parse(offer_details.offerdaysetting);
    offer_details.partner = JSON.parse(offer_details.partner);
    offer_details.category = JSON.parse(offer_details.category);
    offer_details.product = JSON.parse(offer_details.product);

    offer_details.updatedon = new Date();

    await Offer.updateOne({ _id: id }, {
        $set: offer_details
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Offer Updated Successfully",
            token: jwt.sign({ id }, 'sphoenix')
        })
    }).catch((err) => {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: err.message
        });
    });
})

Router.get('/offer', async function (req, res) {
    await Offer.find({ status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All Offer List",
                token: jwt.sign({ data }, 'sphoenix')
            })
        }).catch((err) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: err.message
            });
        });
})

Router.get('/offer/:id', async function (req, res) {
    const id = req.params.id;
    await Offer.find({ _id: id, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All Offer List By ID",
                token: jwt.sign({ data }, 'sphoenix')
            })
        }).catch((err) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: err.message
            });
        });
})

Router.put('/offer_delete/:id', async function (req, res) {
    const id = req.params.id;
    await Offer.updateOne({ _id: id }, {
        $set: {
            status: 3,
            updatedon: new Date(),
        }
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Offer Deleted Successfully",
            token: jwt.sign({ id }, 'sphoenix')
        })
    }).catch((err) => {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: err.message
        });
    });
})

Router.post('/offer_action', async function (req, res) {
    var id = req.body.ids;
    var type = req.body.type;

    await Offer.updateMany({ status: { $in: [1, 2] }, _id: { $in: id } }, {
        $set: {
            status: (type === 'active' ? 1 : (type === 'inactive' ? 2 : (type === 'delete' ? 3 : ''))),
            updatedon: new Date(),
        }
    }).then((resp) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Offer " + (type === 'active' ? 'Active' : (type === 'inactive' ? 'In Active' : (type === 'delete' ? 'Delete' : ''))) + " Successfully !",
        })
    }).catch((resp) => {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Something went wrong ! Please Try Again !",
        })
    })
})

Router.post('/offer_deals', async (req, res) => {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var currentDay = days[d.getDay()];

    let productData = [];
    let offerDetails = await Offer.find({ 'offerdaysetting.label': currentDay, status: 1 }, { createdon: 0, updatedon: 0, __v: 0 })

    for (let i = 0; i < offerDetails.length; i++) {
        let productIds = []
        if (offerDetails[i].product.length !== 0) {
            if (offerDetails[i].validitytype === 2) {
                if (common.dateFormat(offerDetails[i].validitydate) <= common.dateFormat(new Date())) {
                    offerDetails[i].product.forEach(e => {
                        productIds.push(e.value)
                    });

                    let productDetails = await Product.find({ _id: { $in: productIds }, status: 1 }, { createdon: 0, updatedon: 0, __v: 0 })
                    productDetails.forEach(val => {
                        productData.push({
                            id: val._id,
                            name: val.name,
                            description: val.description,
                            type: val.type,
                            price: val.price,
                            packing_cost: val.packing_cost,
                            tax: val.tax,
                            taxvalue: val.taxvalue,
                            totalprice: val.totalprice,
                            min_qty: val.min_qty,
                            unit: val.unit,
                            is_inventory: val.is_inventory,
                            status: val.status,
                            tracking: val.tracking,
                            minstock: val.minstock,
                            category: val.category,
                            subcategory: val.subcategory,
                            images: val.images,
                            variant: val.variant,
                            offerDetails: {
                                _id: offerDetails[i]._id,
                                offercode: offerDetails[i].offercode,
                                offertitle: offerDetails[i].offertitle,
                                description: offerDetails[i].description,
                                offermode: offerDetails[i].offermode,
                                offerapplysetting: offerDetails[i].offerapplysetting,
                                minordervalue: offerDetails[i].minordervalue,
                                maximumdiscount: offerDetails[i].maximumdiscount,
                                offertype: offerDetails[i].offertype,
                                offervalue: offerDetails[i].offervalue,
                                validitytype: offerDetails[i].validitytype,
                                validitydate: offerDetails[i].validitydate,
                                status: offerDetails[i].status,
                            }
                        })
                    });
                }
            }
            else {
                offerDetails[i].product.forEach(e => {
                    productIds.push(e.value)
                });

                let productDetails = await Product.find({ _id: { $in: productIds }, status: 1 }, { createdon: 0, updatedon: 0, __v: 0 })
                productDetails.forEach(val => {
                    productData.push({
                        id: val._id,
                        name: val.name,
                        description: val.description,
                        type: val.type,
                        price: val.price,
                        packing_cost: val.packing_cost,
                        tax: val.tax,
                        taxvalue: val.taxvalue,
                        totalprice: val.totalprice,
                        min_qty: val.min_qty,
                        unit: val.unit,
                        is_inventory: val.is_inventory,
                        status: val.status,
                        tracking: val.tracking,
                        minstock: val.minstock,
                        category: val.category,
                        subcategory: val.subcategory,
                        images: val.images,
                        variant: val.variant,
                        offerDetails: {
                            _id: offerDetails[i]._id,
                            offercode: offerDetails[i].offercode,
                            offertitle: offerDetails[i].offertitle,
                            description: offerDetails[i].description,
                            offermode: offerDetails[i].offermode,
                            offerapplysetting: offerDetails[i].offerapplysetting,
                            minordervalue: offerDetails[i].minordervalue,
                            maximumdiscount: offerDetails[i].maximumdiscount,
                            offertype: offerDetails[i].offertype,
                            offervalue: offerDetails[i].offervalue,
                            validitytype: offerDetails[i].validitytype,
                            validitydate: offerDetails[i].validitydate,
                            status: offerDetails[i].status,
                        }
                    })
                });
            }
        }
    }

    res.status(200).json({
        statuscode: 200,
        status: true,
        token: jwt.sign({ data: productData }, 'sphoenix')
    })
})

Router.post('/offer_mode', async (req, res) => {
    let productData = [];
    let offerDetails = await Offer.find({ offermode: null, status: 1 }, { createdon: 0, updatedon: 0, __v: 0 })

    for (let i = 0; i < offerDetails.length; i++) {
        if (offerDetails[i].validitytype === 2) {
            if (common.dateFormat(offerDetails[i].validitydate) <= common.dateFormat(new Date())) {
                productData.push({
                    _id: offerDetails[i]._id,

                    offercode: offerDetails[i].offercode,
                    offertitle: offerDetails[i].offertitle,
                    description: offerDetails[i].description,
                    offermode: offerDetails[i].offermode,
                    offerapplysetting: offerDetails[i].offerapplysetting,
                    minordervalue: offerDetails[i].minordervalue,
                    maximumdiscount: offerDetails[i].maximumdiscount,
                    offertype: offerDetails[i].offertype,
                    offervalue: offerDetails[i].offervalue,
                    validitytype: offerDetails[i].validitytype,
                    validitydate: offerDetails[i].validitydate,
                    status: offerDetails[i].status,
                })
            }
        }
        else {
            productData.push({
                _id: offerDetails[i]._id,
                offercode: offerDetails[i].offercode,
                offertitle: offerDetails[i].offertitle,
                description: offerDetails[i].description,
                offermode: offerDetails[i].offermode,
                offerapplysetting: offerDetails[i].offerapplysetting,
                minordervalue: offerDetails[i].minordervalue,
                maximumdiscount: offerDetails[i].maximumdiscount,
                offertype: offerDetails[i].offertype,
                offervalue: offerDetails[i].offervalue,
                validitytype: offerDetails[i].validitytype,
                validitydate: offerDetails[i].validitydate,
                status: offerDetails[i].status,
            })
        }
    }

    res.status(200).json({
        statuscode: 200,
        status: true,
        token: jwt.sign({ data: productData }, 'sphoenix')
    })
})
// Offer API's End

// GST API
Router.get('/gst_list', async function (req, res) {
    await GST.find({ status: { $in: [1, 2] } })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All GST List",
                token: jwt.sign({ data }, 'sphoenix')
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