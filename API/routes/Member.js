// Third Party Module
const express = require('express');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const uuid = require('uuid')
const client = require('twilio')(process.env.accountSid, process.env.authToken);
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const common = require('../commonFun')
const ObjectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcrypt');
// DATABASE
const Otp = require("../models/OtpModel");
const Member = require("../models/MemberModel");
const UserType = require("../models/UserTypeModel");
const User = require("../models/UserModel");
const ShopingCart = require('../models/CartModel');
const Offer = require('../models/OfferModel');
const Product = require("../models/ProductModel");
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
    try {
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
                            token: jwt.sign({ response }, 'sphoenix')
                        })
                        // });
                });
            }
        });
    } catch (err) {
        res.status(400).json({
            statuscode: 400,
            status: true,
            message: "OTP added failed"
        })
    }
});
// RESEND OTP END

// OTP VERIFY START 
Router.post("/verify_otp", async function(req, res) {
    console.log("Start");
    let { mobile, otp } = req.body;
    let isExist = await User.findOne({ mobile: mobile })
    console.log(isExist, "Exist user");
    let mobileStatus = await Otp.find({ otpstatus: "open", mobile: mobile });
    console.log(mobileStatus);
    console.log(mobileStatus, "Mobile valid");
    if (mobileStatus.length === 0) {
        return res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Invalid Mobile No or OTP Expired !"
        })
    }

    let otpStatus = await Otp.find({ otpstatus: "open", mobile: mobile, otp: otp });
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
            await Member.findOne({ mobile: mobile })
                .then((data, err) => {
                    console.log(data, "Member valid")
                    if (data) {
                        var token = crypto.randomBytes(64).toString('hex');
                        if (isExist) {
                            console.log(isExist, "Final user exist");
                            isExist.accesstoken = token;
                            isExist.firebasetoken = req.body.fb_token;
                            isExist.save().then(user => {
                                console.log("user updated successfully");
                                res.status(200).json({
                                    statuscode: 200,
                                    status: true,
                                    message: "Member Logged In",
                                    token: jwt.sign({
                                        data: {
                                            is_exist: (isExist !== null) ? 1 : 0,
                                            customer_data: data,
                                            accesstoken: user.accesstoken,
                                            firebasetoken: req.body.fb_token
                                        }
                                    }, 'sphoenix')
                                });
                            })
                        } else {
                            console.log(data, 'Final user not exist');
                            res.status(200).json({
                                statuscode: 200,
                                status: true,
                                message: "Member Logged In",
                                token: jwt.sign({
                                    data: {
                                        is_exist: (isExist !== null) ? 1 : 0,
                                        customer_data: []
                                    }
                                }, 'sphoenix')
                            })
                        }
                    } else {
                        console.log(data, 'Final user not exist');
                        res.status(200).json({
                            statuscode: 200,
                            status: true,
                            message: "Member Otp verify success",
                            token: jwt.sign({
                                data: {
                                    is_exist: (isExist !== null) ? 1 : 0,
                                    customer_data: []
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
//forget password
Router.post("/forget_password", async(req, res) => {
    let email = req.body.email;
    if (email != '') {

        //var userdata = await User.findOne({ username: req.body.username, status: 1 });

        let token = crypto.randomBytes(128).toString('hex');

        let link = 'http://algrix.in/miyami/#/changePassword/' + token;
        transporter.sendMail({
            from: 'mequalstesting@gmail.com',
            to: email,
            subject: 'Forget Password - Link',
            text: link
        }, async(err, data) => {
            if (err) {
                // return console.log('Error occurs', err);
            }
            var Memberdata = await Member.find({ email: email });
            // console.log(Memberdata[0]);
            if (Memberdata[0]) {
                await User.updateOne({ _id: Memberdata[0].user_id }, {
                        $set: {
                            accesstoken: token,
                            updatedon: new Date()
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
                    status: true,
                    statuscode: 200,
                    message: 'Mail Sent'
                })
            } else {
                res.status(400).json({
                    status: false,
                    statuscode: 400,
                    message: 'Enter Correct Email ID'
                })
            }

        });

    } else {
        res.status(400).json({
            status: false,
            statuscode: 400,
            message: 'Enter Email ID'
        })
    }
});
//Update password
Router.post("/password_update", async(req, res) => {
    let user = req.body;
    var Userdata = await User.find({ accesstoken: user.token });
    if (user.password === user.confirm_password) {
        let password = await bcrypt.hash(user.password, 10);
        await User.updateOne({ _id: Userdata[0]._id }, {
                $set: {
                    password: password,
                    og_password: user.password,
                    updatedon: new Date()
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
            status: true,
            statuscode: 200,
            message: 'Password Updated'
        })

    } else {
        res.status(400).json({
            status: false,
            statuscode: 400,
            message: 'Password and Confirm mpassword must be same'
        })
    }

});


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

        // if (member.shopname === '' || member.shopname === undefined) {
        //     return res.status(422).json({
        //         status: false,
        //         statuscode: 422,
        //         message: "Please Enter Shopname !"
        //     })
        // }


        // SELFIE UPLOAD END

        var userType = await UserType.findOne({ user_type: "Member" });
        let userCode = await User.findOne().sort({ createdon: -1 });
        let isExist = await User.findOne({ mobile: member.mobile });
        user.usertypeid = userType._id;
        user.username = member.mobile;
        user.mobile = member.mobile;
        user.deviceid = member.deviceid;
        user.devicetype = member.devicetype;
        user.is_online = 1;
        user.status = 1;
        if (isExist) {
            res.status(400).json({
                status: false,
                statuscode: 400,
                message: 'Mobie Already Exists'
            })
        } else {
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
                        console.log(response);
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
        }

    })
    // MEMBER REGISTER END

// MEMBER PROFILE LIST START
Router.post('/profile', async(req, res) => {
        let data = await Member.findById(req.body.id)

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
            let product_details = cartData.product_details;
            for (let j = 0; j < product_details.length; j++) {
                product_details[j].id = uuid.v4();
            }
            cartData.product_details = product_details;
            let product_data = cartData.product_details;
            cartData.product_details = [...cartExist[0].product_details, ...cartData.product_details];
            cartData.updateon = new Date();
            cartData.updatedby = cartData.member_id;
            let datas = [];
            datas.push({
                cart_id: cartExist[0]._id,
                product_data: product_data,
                member_id: cartData.member_id,
            })

            await ShopingCart.updateOne({ member_id: cartData.member_id }, { $set: cartData })
                .then((data) => {
                    res.status(200).json({
                        statuscode: 200,
                        status: true,
                        message: 'Cart Updated Successfully',
                        token: jwt.sign({ datas }, 'sphoenix')
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
            let product_details = cartData.product_details;
            for (let j = 0; j < product_details.length; j++) {
                product_details[j].id = uuid.v4();
            }
            cartData.product_details = product_details;
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
        await ShopingCart.findOne({ status: 1, member_id: member_id })
            .then(async(data, err) => {
                if (data) {
                    let detail = data.product_details;
                    let sum_qty = detail.length;
                    let total_qty = 0;
                    for (let j = 0; j < detail.length; j++) {
                        await Product.findOne({ status: 1, _id: detail[j].product_id })
                            .then((res, err) => {
                                detail[j].product_image = res.images;
                            });
                        total_qty += detail[j].qty;
                    }
                    sum_qty = total_qty;
                    data.product_details = detail;
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
                                    sum_qty: sum_qty,
                                    status: data.status
                                }
                            }, 'sphoenix')
                        })
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        statuscode: 200,
                        message: 'No data found !'
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
                    token: jwt.sign({ card_id: cartData[0]._id }, 'sphoenix'),
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
        addressDetails.createdby = id;
        addressDetails.createdon = new Date();
        addressDetails.status = 4;
        await Member.updateOne({ _id: id }, {
            $set: {
                address: [...memberData.address, addressDetails],
                updatedon: new Date(),
                updatedby: id
            }
        })

        let memeberdata = await Member.findById(id)
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
            if (req.body.address_id != '') {
                let Memberdata = await Member.findById(req.body.member_id).then(memberData => {

                    if (memberData) {
                        let key = memberData.address.findIndex(e => e.id === req.body.address_id);
                        let data = memberData.address[key];

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
                            message: 'Member Shop Empty !'
                        })
                    }

                }).catch(err => {
                    res.status(400).json({
                        status: false,
                        statuscode: 200,
                        message: 'Member id not found'
                    })

                })
            } else {
                let Memberdata = await Member.findById(req.body.member_id).then(memberData => {
                    if (memberData) {
                        let data = [];
                        memberData.address.forEach(e => {
                            data.push({
                                "id": e.id,
                                "shop_name": e.shop_name,
                                "gst_in_number": e.gst_in_number,
                                "address_type": e.address_type,
                                "status": e.status
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
                            message: 'Member Shop Empty !'
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
    // MEMBER ADDRESS LIST END

// MEMBER ADDRESS LIST START
Router.post('/approve_list_address', async(req, res) => {
        if (req.body.member_id !== '') {

            let Memberdata = await Member.findById(req.body.member_id).then(memberData => {
                if (memberData) {
                    let data = [];
                    memberData.address.forEach(e => {
                        if (e.status == 5) {
                            data.push({
                                "id": e.id,
                                "shop_name": e.shop_name,
                                "gst_in_number": e.gst_in_number,
                                "address_type": e.address_type
                            })
                        }
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
                        message: 'Member Shop Empty !'
                    })
                }

            }).catch(err => {
                res.status(400).json({
                    status: false,
                    statuscode: 200,
                    message: 'Member id not found'
                })

            })

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

        await Member.findById(req.body.memberid).then(async(data) => {

            if (data) {

                await Member.updateOne({ _id: req.body.memberid, 'address.id': req.params.detail_id }, {
                        $set: {
                            'address.$.shop_name': req.body.shop_name,
                            'address.$.gst_in_number': req.body.gst_in_number,
                            'address.$.address_type': req.body.address_type,
                            'address.$.updatedby': req.body.memberid,
                            'address.$.updatedon': new Date()
                        }
                    },
                    (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    }
                );


                let key = data.address.findIndex(e => e.id === req.body.detail_id);
                if (key >= 0) {
                    data.address[key].shop_name = req.body.shop_name;
                    data.address[key].gst_in_number = req.body.gst_in_number;
                    data.address[key].address_type = req.body.address_type;
                    data.address[key].updatedby = req.body.memberid;
                    data.address[key].updatedon = new Date();






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
            } else {
                res.status(200).json({
                    status: false,
                    statuscode: 200,
                    message: 'Address is empty. please enter valid data'
                })
            }
        }).catch(err => {
            res.status(400).json({
                status: false,
                statuscode: 400,
                message: 'please enter valid data,Member not exists'
            })
        })
    })
    // MEMBER ADDRESS UPDATE END

Router.post('/addressremove', async(req, res) => {
    member = await Member.findById(req.body.member_id);

    if (member !== null) {

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
    await Member.find({ status: { $nin: [3] } })
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
    await Member.find({ status: { $nin: [3] }, _id: id })
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
    await Offer.find({ status: { $in: [1, 2] }, product: { $elemMatch: { value: { $in: product_ids } } } })
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
module.exports = Router;