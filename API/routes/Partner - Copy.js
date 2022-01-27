// Third Party Modules
const express = require('express')
const Router = express.Router()
var jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path')
const fs = require('fs')

var partner_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var appDir = path.dirname(require.main.filename);
        appDir = appDir.slice(0, -3);
        var paths = appDir + process.env.IMAGE_DIR + '/partner/';
        if (!fs.existsSync(paths)) {
            fs.mkdir(paths, { recursive: true }, err => { })
        }
        cb(null, paths)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var partner_upload = multer({ storage: partner_storage })

// Datebase Models
const Partner = require("../models/PartnerModel");

// Partner API's Start
Router.post('/partner', partner_upload.single('file'), async function (req, res) {
    let partner_details = req.body;
    if (req.file) {
        partner_details.image = process.env.IMAGE_URL+'/partner/'+req.file.originalname;
    }
    partner_details.category = JSON.parse(partner_details.category)
    partner_details.createdon = new Date();
    partner_details.updatedon = null;
    partner_details.status = 1;

    let partnerDetails = new Partner(partner_details);
    await partnerDetails.save(function (err, data) {
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
                message: "Partner Created Successfully",
                token: jwt.sign({ id }, 'sphoenix'),
            })
        }
    })
})

Router.post('/partner_exist', async (req, res) => {
    var data = await Partner.findOne({ title: req.body.title, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 });
    if (data) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This Partner Title Already Exist, Please Try Again !"
        })
    }
    else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Partner Tittle !"
        })
    }
})

Router.put('/partner_exist/:id', async (req, res) => {
    var data = await Partner.find({ title: req.body.title, _id: { $ne: req.body.id }, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 });
    if (data.length != 0) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This Partner Title Already Exist, Please Try Again !"
        })
    }
    else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Partner Tittle !"
        })
    }
})

Router.put('/partner/:id', partner_upload.single('file'), async function (req, res) {
    const id = req.params.id;
    let partner_details = req.body;

    if (req.file) {
        partner_details.image = process.env.IMAGE_URL+'/partner/'+req.file.originalname;
    }
    partner_details.category = JSON.parse(partner_details.category)
    partner_details.updatedon = new Date();

    await Partner.updateOne({ _id: id }, {
        $set: partner_details
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Partner Updated Successfully",
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

Router.get('/partner', async function (req, res) {
    await Partner.find({ status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All Partner List",
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

Router.get('/partner/:id', async function (req, res) {
    const id = req.params.id;
    await Partner.find({ _id: id, status: { $in: [1, 2] } }, { createdon: 0, updatedon: 0, __v: 0 })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All Partner List By ID",
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

Router.put('/partner_delete/:id', async function (req, res) {
    const id = req.params.id;
    await Partner.updateOne({ _id: id }, {
        $set: {
            status: 3,
            updatedon: new Date(),
        }
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Partner Deleted Successfully",
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

Router.post('/partner_action', async function (req, res) {
    var id = req.body.ids;
    var type = req.body.type;

    await Partner.updateMany({ status: { $in: [1, 2] }, _id: { $in: id } }, {
        $set: {
            status: (type === 'active' ? 1 : (type === 'inactive' ? 2 : (type === 'delete' ? 3 : ''))),
            updatedon: new Date(),
        }
    }).then((resp) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Partner " + (type === 'active' ? 'Active' : (type === 'inactive' ? 'In Active' : (type === 'delete' ? 'Delete' : ''))) + " Successfully !",
        })
    }).catch((resp) => {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Something went wrong ! Please Try Again !",
        })
    })
})
// Partner API's End

module.exports = Router;