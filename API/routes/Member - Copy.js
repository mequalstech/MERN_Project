// Third Party Module
const express = require('express');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const uuid = require('uuid')
const client = require('twilio')(process.env.accountSid, process.env.authToken);
const nodemailer = require("nodemailer");
const crypto = require('crypto')
const common = require('../commonFun')
const ObjectId = require('mongoose').Types.ObjectId

// DATABASE
const Otp = require("../models/OtpModel");
const Member = require("../models/MemberModel");
const UserType = require("../models/UserTypeModel");
const User = require("../models/UserModel");
const ShopingCart = require('../models/CartModel');
const Offer = require('../models/OfferModel');

// MAIL CONFIGURATION
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.mailUserName,
        pass: process.env.mailPassword
    }
});

// SEND OTP START
Router.post("/send_otp", async function(req, res) {
    var { devicetype, mobile } = req.body;

    var minm = 1111;
    var maxm = 9999;

    if ((devicetype != '') && (mobile != '')) {
        var MemberOtp = {}
        MemberOtp.mobile = mobile;
        MemberOtp.otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
        MemberOtp.otpstatus = 'open';
        MemberOtp.devicetype = devicetype;
        MemberOtp.createdon = new Date();

        let OtpModel = new Otp(MemberOtp);
        await OtpModel.save(async function(err, data) {
            if (err) {
                res.status(200).json({
                    statuscode: 400,
                    status: false,
                    message: err.message
                })
            } else {
                // const accountSid = 'AC6a940763c0607dca340a0aaf89e2669b';
                // const authToken = '54bb4d55d4cf701199d660bdca16a914';
                // const client = require('twilio')(accountSid, authToken);

                // client.messages
                //     .create({
                //         body: 'Hello World',
                //         messagingServiceSid: 'MG0f106567347f07b874b81e4f3fd74136',
                //         to: '+91' + mobile
                //     })
                //     .then(message => {
                res.status(200).json({
                        statuscode: 200,
                        status: true,
                        message: "OTP Added Successfully !",
                        token: jwt.sign({ data }, 'sphoenix'),
                    })
                    // })
                    // .catch((e) => {
                    //     console.log(e.message)
                    // })
                    // .done();

            }
        });

    } else {
        res.status(200).json({
            statuscode: 409,
            status: false,
            message: "Enter Mobile number"
        })
    }

});
// SEND OTP END

// RESEND OTP START
Router.post("/resend_otp", async function(req, res) {
    var id = req.body.id;

    var minm = 1111;
    var maxm = 9999;
    var current_datetime = new Date();
    var data = {};
    var query = { _id: id };
    await Otp.find(query).then(async results => {
        if (results != undefined && results.length > 0) {
            data['updatedon'] = new Date();
            data['updatedby'] = 1;
            data['otp'] = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
            var newvalues = { $set: data };
            var response = data;
            await Otp.updateOne({ _id: id }, newvalues).then(async(results) => {
                // const from = 'sphoenix';
                // const to = '91' + results.mobileno;
                // const text = 'Your sphoenix verification code is:' + data['otp'];
                // await client.messages
                //     .create({
                //         body: text,
                //         from: '+12058909136',
                //         to: '+919074865475'
                //     })
                // .then(message => {
                res.status(200).json({
                        statuscode: 200,
                        status: true,
                        message: "OTP added",
                        token: jwt.sign({ response }, 'sphoenix'),
                        Otp: data['otp'],
                        id: id
                    })
                    // });
            });
        }
    });
});
// RESEND OTP END

// OTP VERIFY START 
Router.post("/verify_otp", async function(req, res) {
    let { mobile, otp } = req.body;
    let token = crypto.randomBytes(24).toString('hex');
    let isExist = await User.findOne({ mobile: mobile }, { createdon: 0, updatedon: 0, __v: 0 })
    let mobileStatus = await Otp.find({ otpstatus: "open", mobile: mobile }, { createdon: 0, updatedon: 0, __v: 0 });

    if (mobileStatus.length === 0) {
        return res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Invalid Mobile No or OTP Expired !"
        })
    }

    let otpStatus = await Otp.find({ otpstatus: "open", mobile: mobile, otp: otp }, { createdon: 0, updatedon: 0, __v: 0 });
    if (otpStatus.length === 0) {
        return res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Invalid OTP !"
        })
    }

    await Otp
        .updateOne({ otpstatus: "open", mobile: mobile }, {
            $set: {
                otpstatus: 'closed',
                updatedon: new Date(),
                updatedby: 1,
            }
        })
        .then(async(result, err) => {
            if (err)
                res.status(400).json({
                    statuscode: 400,
                    status: false,
                    message: "Something went wrong !. Please try again !",
                    error: err.message
                })

            await Member.findOne({ mobile: mobile }, { createdon: 0, updatedon: 0, __v: 0 })
                .then((data, err) => {
                    if (isExist) {
                        res.status(200).json({
                            statuscode: 200,
                            status: true,
                            message: "Member Logged In",
                            token: jwt.sign({
                                data: {
                                    is_exist: (isExist !== null) ? 1 : 0,
                                    customer_data: data,
                                    access_token: token
                                }
                            }, 'sphoenix')
                        })
                    } else {
                        res.status(200).json({
                            statuscode: 200,
                            status: true,
                            message: "Member Logged In",
                            token: jwt.sign({
                                data: {
                                    is_exist: (isExist !== null) ? 1 : 0,
                                    customer_data: [],
                                    access_token: token
                                }
                            }, 'sphoenix')
                        })
                    }
                })
                .catch((e) => {
                    res.status(400).json({
                        statuscode: 400,
                        status: false,
                        message: "Something went wrong !. Please try again !",
                        error: e.message
                    })
                })
        })
        .catch((e) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: "Something went wrong !. Please try again !",
                error: e.message
            })
        })
});
// OTP VERIFY END
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {

        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    }
})
const maxSize = 1 * 1000 * 1000;

var upload_gst = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function(req, file, cb) {

        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the " +
            "following filetypes - " + filetypes);
    }
}).single("GST");
var upload_selfie = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function(req, file, cb) {

        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the " +
            "following filetypes - " + filetypes);
    }
}).single("SELFIE");
var upload_bcard = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function(req, file, cb) {

        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the " +
            "following filetypes - " + filetypes);
    }
}).single("BUSINESS_CARD");
// MEMBER REGISTER START
Router.post("/member_register", async(req, res) => {
        let member = req.body;
        let user = {}
        if (member.name === '' || member.name === undefined) {
            return res.status(422).json({
                status: false,
                statuscode: 422,
                message: "Please Enter Member Name !"
            })
        }

        if (member.email === '' || member.email === undefined) {
            return res.status(422).json({
                status: false,
                statuscode: 422,
                message: "Please Enter E-Mail !"
            })
        }

        if (member.mobile === '' || member.mobile === undefined) {
            return res.status(422).json({
                status: false,
                statuscode: 422,
                message: "Please Enter Mobile No !"
            })
        }

        if (member.shopname === '' || member.shopname === undefined) {
            return res.status(422).json({
                status: false,
                statuscode: 422,
                message: "Please Enter Shopname !"
            })
        }

        // GST PHOTO UPLOAD START
        if (member.attachments[0].image_encode) {
            var string = member.attachments[0].type.split(",");
            let buff = Buffer.from(string[1], 'base64');
            var appDir = path.dirname(require.main.filename);
            appDir = appDir.slice(0, -3);
            var paths = appDir + process.env.IMAGE_DIR + '/member/attachment/gst/';
            if (!fs.existsSync(paths)) {
                fs.mkdir(paths, { recursive: true }, err => {})
            }

            var newpath = paths + member.attachments[0].filename;

            fs.writeFile(newpath, buff, function(err) {
                if (err) throw err;
            });
        }
        // GST PHOTO UPLOAD END

        // BUSINESS_CARD UPLOAD START
        if (member.attachments[1].image_encode) {
            var string = member.attachments[1].type.split(",");
            let buff = Buffer.from(string[1], 'base64');
            var appDir = path.dirname(require.main.filename);
            appDir = appDir.slice(0, -3);
            var paths = appDir + process.env.IMAGE_DIR + '/member/attachment/business_card/';
            if (!fs.existsSync(paths)) {
                fs.mkdir(paths, { recursive: true }, err => {})
            }

            var newpath = paths + member.attachments[1].filename;

            fs.writeFile(newpath, buff, function(err) {
                if (err) throw err;
            });
        }
        // BUSINESS_CARD UPLOAD END

        // SELFIE UPLOAD START
        if (member.attachments[2].image_encode) {
            var string = member.attachments[2].type.split(",");
            let buff = Buffer.from(string[1], 'base64');
            var appDir = path.dirname(require.main.filename);
            appDir = appDir.slice(0, -3);
            var paths = appDir + process.env.IMAGE_DIR + '/member/attachment/profile/';
            if (!fs.existsSync(paths)) {
                fs.mkdir(paths, { recursive: true }, err => {})
            }

            var newpath = paths + member.attachments[2].filename;

            fs.writeFile(newpath, buff, function(err) {
                if (err) throw err;
            });
        }
        // SELFIE UPLOAD END

        var userType = await UserType.findOne({ user_type: "Member" });
        let userCode = await User.findOne().sort({ createdon: -1 });
        let isExist = await User.findOne({ mobile: member.mobile });

        user.usertypeid = userType._id;
        user.mobile = member.mobile;
        user.deviceid = member.deviceid;
        user.devicetype = member.devicetype;
        user.accesstoken = member.accesstoken;
        user.devicetoken = member.devicetoken;
        user.is_online = 1;
        user.status = 4;

        if (userCode)
            user.code = (userCode.code != undefined) ? common.incrementString(userCode.code) : 'SAUSR_00001';
        else
            user.code = 'SAUSR_00001';

        user.createdon = new Date();
        user.updatedon = null;

        let userData = new User(user);

        await userData.save(async function(err, user) {
            if (err) {
                res.status(200).json({
                    statuscode: 400,
                    status: false,
                    message: "User Not Inserted. Something went wrong ! "
                })
            }
            if (user) {
                let memberCode = await Member.findOne().sort({ createdon: -1 });
                if (memberCode)
                    member.code = (memberCode.code) ? common.incrementString(memberCode.code) : 'SAMEM_00001';
                else
                    member.code = 'SAMEM_00001';

                member.mobile = req.body.mobile;
                member.user_id = user._id;
                member.createdby = user._id;
                member.createdon = new Date();
                member.updatedon = null;
                member.status = 4;

                let memberData = new Member(member);
                await memberData.save(function(err, response) {
                    let data = response
                    data.is_exist = (isExist !== null) ? 0 : 1

                    if (err) {
                        res.status(200).json({
                            statuscode: 400,
                            status: false,
                            message: "Member Not Inserted. Something went wrong !"
                        })
                    } else {
                        res.status(200).json({
                            statuscode: 200,
                            status: true,
                            message: "Member Created Successfully",
                            token: jwt.sign({ data }, 'sphoenix'),
                        })
                    }
                });
            }
        })
    })
    // MEMBER REGISTER END

// MEMBER PROFILE LIST START
Router.post('/profile', async(req, res) => {
        let data = await Member.findById(req.body.id, { createdon: 0, updatedon: 0, __v: 0 })

        res.status(200).json({
            status: true,
            statuscode: 200,
            token: jwt.sign({ data }, 'sphoenix')
        })
    })
    // MEMBER PROFILE LIST END

// CART ADD START
Router.post('/addcart', async(req, res) => {
        let cartData = req.body;
        let cartExist = await ShopingCart.find({ status: { $in: [1, 2] }, member_id: cartData.member_id })

        if (cartExist.length > 0) {
            cartData.product_details = [...cartExist[0].product_details, ...cartData.product_details];
            cartData.updateon = new Date();
            cartData.updatedby = cartData.member_id;

            await ShopingCart.updateOne({ member_id: cartData.member_id }, { $set: cartData })
                .then((data) => {
                    res.status(200).json({
                        statuscode: 200,
                        status: true,
                        message: 'Cart Updated Successfully',
                        token: jwt.sign({ data }, 'sphoenix')
                    })
                })
                .catch((e) => {
                    res.status(400).json({
                        status: false,
                        statuscode: 400,
                        message: "Something went wrong"
                    })
                })
        } else {
            cartData.createdby = cartData.member_id;
            cartData.createdon = new Date();
            cartData.status = 1;
            cartData.updateon = null;
            cartData.updatedby = null;

            let cartDetails = new ShopingCart(cartData);

            await cartDetails.save(function(err, data) {
                if (err) {
                    res.status(400).json({
                        status: false,
                        statuscode: 400,
                        message: 'Something went wrong !. please try again'
                    })
                } else {
                    res.status(200).json({
                        status: true,
                        statuscode: 200,
                        token: jwt.sign({ data }, 'sphoenix')
                    })
                }
            })
        }
    })
    // CART ADD END

// CART LIST START
Router.post('/getcart', async(req, res) => {
        let { member_id } = req.body;
        await ShopingCart.findOne({ status: 1, member_id: member_id }, { createdon: 0, updatedon: 0, __v: 0, createdby: 0, updatedby: 0 })
            .then((data, err) => {
                let sum_qty = data.product_details.map((e, i) => {
                    if (i === 0)
                        qty = parseInt(e.qty);
                    else
                        qty = (parseInt(e.qty) + parseInt(qty))

                    return qty
                })

                if (err) {
                    res.status(400).json({
                        statuscode: 400,
                        status: false,
                        message: 'Something went wrong'
                    })
                } else {
                    res.status(200).json({
                        statuscode: 200,
                        status: true,
                        token: jwt.sign({
                            data: {
                                _id: data._id,
                                member_id: data.member_id,
                                product_details: data.product_details,
                                sum_qty: sum_qty[0],
                                status: data.status
                            }
                        }, 'sphoenix')
                    })
                }
            }).catch((er) => {
                res.status(400).json({
                    statuscode: 400,
                    status: false,
                    message: er.message
                })
            })
    })
    // CART LIST END

// CART REMOVE START
Router.post('/cartremove', async(req, res) => {
        cartData = await ShopingCart.find({ status: 1, member_id: req.body.member_id, _id: req.body.cartid });
        if (cartData.length >= 0) {
            const index = cartData.findIndex(x => x.member_id === req.body.member_id);

            if (index !== undefined) {
                const subindex = cartData[index].product_details.findIndex(e => (e.id === req.body.detail_id && e.product_id === req.body.product_id))
                cartData[index].product_details.splice(subindex, 1)
            }

            // cartData[index].updatedon = new Date();
            // cartData[index].updatedby = cartData[index].member_id;

            await ShopingCart.updateOne({ member_id: req.body.member_id }, {
                $set: {
                    'product_details': cartData[index].product_details,
                    'cartData.updatedon': new Date(),
                    'cartData.updatedby ': cartData[index].member_id
                }
            }).then((response) => {
                res.status(200).json({
                    status: true,
                    statuscode: 200,
                    message: 'Cart Deleted Success !!!'
                })
            }).catch((err) => {
                res.status(400).json({
                    statuscode: 400,
                    status: false,
                    message: err.message
                });
            });
        } else {
            res.status(200).json({
                status: false,
                statuscode: 200,
                message: 'Your Cart is Empty !.'
            })
        }
    })
    // CART REMOVE END

// Cart Update Start
Router.post('/cartupdate', async(req, res) => {
        let data = req.body;
        cartData = await ShopingCart.find({ status: 1, member_id: req.body.member_id, _id: req.body.cartid });
        if (cartData.length >= 0) {
            const index = cartData.findIndex(x => x.member_id === req.body.member_id);

            if (index !== undefined) {
                const subindex = cartData[index].product_details.findIndex(e => (e.id === req.body.detail_id && e.product_id === req.body.product_id))
                if (subindex >= 0) {

                    if (data.qty)
                        cartData[index].product_details[subindex].qty = data.qty;

                    if (data.amount)
                        cartData[index].product_details[subindex].amount = data.amount;

                    if (data.rate)
                        cartData[index].product_details[subindex].rate = data.rate;

                    await ShopingCart.updateOne({ member_id: req.body.member_id, _id: req.body.cartid }, {
                        $set: {
                            "product_details": cartData[index].product_details,
                            "cartData.updatedon": new Date(),
                            "cartData.updatedby": req.body.member_id,
                        }
                    }).then((response) => {
                        res.status(200).json({
                            status: true,
                            statuscode: 200,
                            token: jwt.sign({ cartData }, 'sphoenix')
                        })
                    }).catch((err) => {
                        res.status(400).json({
                            statuscode: 400,
                            status: false,
                            message: err.message
                        });
                    });
                } else {
                    res.status(200).json({
                        status: false,
                        statuscode: 200,
                        message: 'Enter Valid Details. Product Details are empty !.'
                    })
                }
            }
        } else {
            res.status(200).json({
                status: false,
                statuscode: 200,
                message: 'Your Cart is Empty !.'
            })
        }
    })
    // Cart Update End

// MEMBER ADDRESS ADD START
Router.post('/address', async(req, res) => {
        let data = [];
        let id = req.body.id;
        let addressDetails = req.body;
        let memberData = await Member.findById(id)

        addressDetails.id = uuid.v4()

        await Member.updateOne({ _id: id }, {
            $set: {
                address: [...memberData.address, addressDetails],
                updatedon: new Date(),
                updatedby: id
            }
        })

        let memeberdata = await Member.findById(id, { createdon: 0, updatedon: 0, __v: 0, attachments: 0 })
        let address_length = memeberdata.address.length

        data.push({
            address: memeberdata.address[address_length - 1]
        })
        res.status(200).json({
            status: true,
            statuscode: 200,
            data: data,
            token: jwt.sign({ data }, 'sphoenix')
        })
    })
    // MEMBER ADDRESS ADD END

// MEMBER ADDRESS LIST START
Router.post('/list_address', async(req, res) => {
        if (req.body.member_id !== '') {
            let Memberdata = await Member.findById(req.body.member_id, { createdon: 0, updatedon: 0, __v: 0 })
            if (Memberdata) {
                let data = [];

                Memberdata.address.forEach(e => {
                    data.push({
                        "id": e.id,
                        "address1": e.address1,
                        "address2": e.address2,
                        "landmark": e.landmark,
                        "pincode": e.pincode,
                        "latitude": e.latitude,
                        "longitude": e.longitude,
                        "address_type": e.address_type
                    })

                })
                res.status(200).json({
                    status: true,
                    statuscode: 200,
                    data: data,
                    token: jwt.sign({ data }, 'sphoenix')
                })
            } else {
                res.status(200).json({
                    status: false,
                    statuscode: 200,
                    message: 'Member Address Empty !'
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
    // MEMBER ADDRESS LIST END

// MEMBER ADDRESS UPDATE START
Router.post('/update_address', async(req, res) => {
        let data = await Member.findById(req.body.memberid, { createdon: 0, updatedon: 0, __v: 0 })

        let key = data.address.findIndex(e => e.id === req.body.detail_id)
        if (key >= 0) {
            data.address[key].address1 = req.body.address1;
            data.address[key].address2 = req.body.address2;
            data.address[key].address_type = req.body.address_type;
            data.address[key].landmark = req.body.landmark;
            data.address[key].latitude = req.body.latitude;
            data.address[key].longitude = req.body.longitude;
            data.address[key].pincode = req.body.pincode;

            await Member.updateOne({ _id: req.body.memberid }, {
                $set: {
                    address: data.address[key],
                    updatedon: new Date(),
                    updatedby: req.body.memberid
                }
            })

            if (data) {
                res.status(200).json({
                    status: true,
                    statuscode: 200,
                    token: jwt.sign({
                        data: {
                            member_id: req.body.memberid,
                            ...data.address
                        }
                    }, 'sphoenix')
                })
            } else {
                res.status(200).json({
                    status: false,
                    statuscode: 200,
                    message: 'Something went wrong !'
                })
            }
        } else {
            res.status(200).json({
                status: false,
                statuscode: 200,
                message: 'Address is empty. please enter valid data'
            })
        }
    })
    // MEMBER ADDRESS UPDATE END

Router.post('/addressremove', async(req, res) => {
    member = await Member.findById(req.body.member_id);

    if (member !== null) {
        console.log(member.address);
        const index = member.address.findIndex(e => e.id === req.body.detail_id)
        if (index !== undefined) {
            member.address.splice(index, 1)
        } else {
            res.status(200).json({
                statuscode: 200,
                status: false,
                message: 'Please Enter valid data !!!'
            });
        }

        await Member.updateOne({ _id: req.body.member_id }, {
            $set: {
                'address': member.address,
                'updatedon': new Date(),
                'updatedby ': req.body.member_id
            }
        }).then((response) => {
            res.status(200).json({
                status: true,
                statuscode: 200,
                message: 'Member Address Removed Success'
            })
        }).catch((err) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: err.message
            });
        });
    } else {
        res.status(200).json({
            status: false,
            statuscode: 200,
            message: 'Address is Empty !.'
        })
    }
})

// FORGET PASSWORD START
/*
    Router.post('/forgetpassword', async (req, res) => {
        let mail = req.body.email;
        await Member.find({ status: { $in: [1, 2] }, email: mail })
            .then((data, err) => {
                if (err) {
                    res.status(400).json({
                        status: false,
                        statuscode: 400,
                        message: 'Something went wrong !'
                    })
                }
                else if (data.length > 0) {
                    transporter.sendMail({
                        from: 'mequalstesting@gmail.com',
                        to: 'mequalstech@gmail.com',
                        subject: 'Nodemailer - Test',
                        text: 'Wooohooo it works!!'
                    }, (err, data) => {
                        if (err) {
                            return console.log('Error occurs', err);
                        }
                        return console.log('Email sent!!!');
                    });
                }
                else {
                    res.status(400).json({
                        status: false,
                        statuscode: 400,
                        message: 'Something went wrong !'
                    })
                }
            })
            .catch((e) => {
                res.status(400).json({
                    status: false,
                    statuscode: 400,
                    message: 'Something went wrong !'
                })
            })
    })
*/
// FORGET PASSWORD END

Router.post('/sendmail', async(req, res) => {
    transporter.sendMail({
        from: 'mequalstesting@gmail.com',
        to: 'mequalstech@gmail.com',
        subject: 'Nodemailer - Test',
        text: 'Wooohooo it works!!'
    }, (err, data) => {
        if (err) {
            return console.log('Error occurs', err);
        }
        return console.log('Email sent!!!');
    });
    res.status(200).json({
        status: true,
        statuscode: 200,
        message: 'mail sent'
    })
})

Router.post('/customer', async(req, res) => {
    await Member.find({ status: { $nin: [3] } }, { createdon: 0, updatedon: 0, __v: 0 })
        .then((data, err) => {
            if (data.length === 0) {
                res.status(400).json({
                    status: false,
                    statuscode: 400,
                    message: 'Customer Empty !'
                })
            } else {
                res.status(200).json({
                    status: true,
                    statuscode: 200,
                    token: jwt.sign({ data }, 'sphoenix')
                })
            }
        })
        .catch((e) => {
            res.status(400).json({
                status: false,
                statuscode: 400,
                message: e.message
            })
        })
})

Router.post('/customer_by_id', async(req, res) => {
    var id = req.body.id;
    await Member.find({ status: { $nin: [3] }, _id: id }, { createdon: 0, updatedon: 0, __v: 0 })
        .then((data, err) => {
            if (data.length === 0) {
                res.status(400).json({
                    status: false,
                    statuscode: 400,
                    message: 'Customer Empty !'
                })
            } else {
                res.status(200).json({
                    status: true,
                    statuscode: 200,
                    token: jwt.sign({ data }, 'sphoenix')
                })
            }
        })
        .catch((e) => {
            res.status(400).json({
                status: false,
                statuscode: 400,
                message: e.message
            })
        })
})

Router.post('/customer_verified', async(req, res) => {
    let id = req.body.id;

    await Member.updateOne({ _id: id }, {
            $set: {
                status: req.body.statuscode,
                updatedon: new Date(),
                updatedby: id
            }
        })
        .catch((er) => {
            return res.status(400).json({
                status: true,
                statuscode: 200,
                message: "User Can't Update. Please Try Again !!"
            })
        })

    let data = await Member.findById(id)

    await User.updateOne({ _id: data.user_id }, {
            $set: {
                status: 1,
                updatedon: new Date(),
                updatedby: data.user_id
            }
        })
        .catch((er) => {
            return res.status(400).json({
                status: true,
                statuscode: 200,
                message: "User Can't Update. Please Try Again !!"
            })
        })

    var status_msg = (parseInt(req.body.statuscode) === 1 ? 'Verified' : (parseInt(req.body.statuscode) === 2 ? 'In Active' : (parseInt(req.body.statuscode) === 3 ? 'Delete' : (parseInt(req.body.statuscode) === 4 ? 'In Progress' : (parseInt(req.body.statuscode) === 5 ? 'Rejected' : (parseInt(req.body.statuscode) === 6 ? 'Hold' : ''))))))

    res.status(200).json({
        status: true,
        statuscode: 200,
        message: 'Member ' + status_msg + ' Successfully !!',
        token: jwt.sign({ data }, 'sphoenix')
    })
})

Router.post('/coupon_list', async(req, res) => {
    let offer = await Offer.find({ status: 1 }, { createdon: 0, updatedon: 0, __v: 0 });
    let offerData = [];

    offer.forEach(e => {

        let a = e.offerdaysetting.map((e) => e.label)
        let strtodate = [a.slice(0, -1).join(', '), a.slice(-1)[0]].join(a.length < 2 ? '' : ' and ');
        let validitydate = (parseInt(e.validitytype) === 2) ? e.validitydate : new Date();
        let offersetting = (parseInt(e.offerapplysetting) === 1 ? "Coupon code can be applied only in 2hrs" : (parseInt(e.offerapplysetting) === 2 ? "Offer valid once per user per day" : (parseInt(e.offerapplysetting) === 3 ? "Offer valid once per user per week" : (parseInt(e.offerapplysetting) === 4 ? "Offer valid once per user per month" : (parseInt(e.offerapplysetting) === 5 ? "Offer valid once per user during the offer period " + common.dateFormat(e.validitydate) : "")))))
        let offerdaysetting = (e.offerdaysetting.length !== 7) ? strtodate : 'All Days'
            // if(e.offermode) {
            //     if(parseInt(e.offermode) == 1) {

        //     }
        //     else {

        //     }
        // }
        offerData.push({
            'id': e._id,
            'offercode': e.offercode,
            'offertitle': e.offertitle,
            'description': e.description,
            'image': e.image,
            'details': [
                "Offer valid only on " + offerdaysetting,
                offersetting,
                "Maximum Discount " + e.maximumdiscount,
                "Orders Above " + e.minordervalue,
                "Other T&Cs may apply",
                "Offer valid till " + common.dateFormat(validitydate)
            ]
        })
    });

    res.status(200).json({
        status: true,
        statuscode: 200,
        message: 'Coupon List',
        token: jwt.sign({ data: offerData }, 'sphoenix')
    })
})

Router.post('/newdeals', async(req, res) => {
    let { product_ids } = req.body;
    await Offer.find({ status: { $in: [1, 2] }, product: { $elemMatch: { value: { $in: product_ids } } } }, { createdon: 0, updatedon: 0, __v: 0 })
        .then((data) => {
            if (data.length > 0) {
                res.status(200).json({
                    statuscode: 200,
                    status: true,
                    message: "New Deals List",
                    token: jwt.sign({ data }, 'sphoenix')
                })
            } else {
                res.status(200).json({
                    statuscode: 200,
                    status: true,
                    message: "Deals is Empty",
                })
            }
        })
        .catch((err) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: err.message
            });
        })
})

module.exports = Router;