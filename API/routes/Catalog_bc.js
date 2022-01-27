// Third Party Modules
const express = require('express')
const Router = express.Router()
var jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const ObjectId = require('mongoose').Types.ObjectId

var PriceList_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var appDir = path.dirname(require.main.filename);
        appDir = appDir.slice(0, -3);
        var paths = appDir + process.env.IMAGE_DIR + '/PriceLists/';
        if (!fs.existsSync(paths)) {
            fs.mkdir(paths, { recursive: true }, err => {})
        }
        cb(null, paths)
    },
    filename: function(req, file, cb) {
        // cb(null, file.originalname.slice(0, -4) + '-' + Date.now() + '.pdf')
        cb(null, file.originalname)
    }
})

var category_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var appDir = path.dirname(require.main.filename);
        console.log(appDir);
        appDir = appDir.slice(0, -3);
        console.log(appDir);
        var paths = appDir + process.env.IMAGE_DIR + './ADMINAPP/public/category';
        console.log(paths);
        if (!fs.existsSync(paths)) {
            fs.mkdir(paths, { recursive: true }, err => {})
        }
        cb(null, paths)
    },
    filename: function(req, file, cb) {
        // cb(null, file.originalname.slice(0, -4) + '-' + Date.now() + '.' + file.mimetype.slice(6))
        cb(null, file.originalname);
    }
})

var subcategory_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var appDir = path.dirname(require.main.filename);
        appDir = appDir.slice(0, -3);
        var paths = appDir + process.env.IMAGE_DIR + '/subcategory/';
        if (!fs.existsSync(paths)) {
            fs.mkdir(paths, { recursive: true }, err => {})
        }
        cb(null, paths)
    },
    filename: function(req, file, cb) {
        // cb(null, file.originalname.slice(0, -4) + '-' + Date.now() + '.' + file.mimetype.slice(6))
        cb(null, file.originalname);
    }
})

var product_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // console.log(file);
        var appDir = path.dirname(require.main.filename);
        appDir = appDir.slice(0, -3);
        var paths = appDir + process.env.IMAGE_DIR + '/product/';
        if (!fs.existsSync(paths)) {
            fs.mkdir(paths, { recursive: true }, err => {})
        }
        cb(null, paths)
    },
    filename: function(req, file, cb) {
        // cb(null, file.originalname.slice(0, -4) + '-' + Date.now() + '.' + file.mimetype.slice(6))
        cb(null, file.originalname);
    }
})

var pricelist_upload = multer({ storage: PriceList_storage })
var category_upload = multer({ storage: category_storage })
var subcategory_upload = multer({ storage: subcategory_storage })
var product_upload = multer({ storage: product_storage })

// Datebase Models
const Category = require("../models/CategoryModel");
const SubCategory = require("../models/SubCategoryModel");
const PriceList = require("../models/PriceListModel");
const Product = require("../models/ProductModel");
const Offer = require('../models/OfferModel')

// Category API's Start
Router.post('/category', category_upload.single('file'), async function(req, res) {
    let category_details = req.body;
    if (req.file) {
        console.log(req.file);
        category_details.filename = process.env.IMAGE_URL + '/category/' + req.file.originalname;
        console.log(category_details.filename);
    }
    category_details.createdon = new Date();
    category_details.updatedon = null;
    category_details.status = 1;

    let categoryDetails = new Category(category_details);
    await categoryDetails.save(function(err, data) {
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
                message: "Category Added Successfully",
                token: jwt.sign({ id }, 'sphoenix'),
            })
        }
    })
})

Router.post('/category_exist', async(req, res) => {
    var data = await Category.findOne({ category: req.body.category, status: { $in: [1, 2] } });
    if (data) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This Category Already Exist, Please Try Again !"
        })
    } else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Category !"
        })
    }
})

Router.put('/category_exist/:id', async(req, res) => {
    var data = await Category.find({ category: req.body.category, _id: { $ne: req.body.id }, status: { $in: [1, 2] } });
    if (data.length != 0) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This Category Already Exist, Please Try Again !"
        })
    } else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Category !"
        })
    }
})

Router.put('/category_sequence/:id', async function(req, res) {
    const id = req.params.id;
    let category_details = req.body;

    var seq_data = await Category.findOne({ sequence: req.body.sequence, status: { $in: [1, 2] } });
    if (seq_data) {
        res.status(200).json({
            status: false,
            statuscode: 200,
            message: "Sequence no doesn't Exist, Please try again !"
        })
    } else {
        await Category.updateOne({ _id: id }, {
            $set: category_details
        }).then((response) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "Category Sequence Successfully",
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
})

Router.put('/category/:id', category_upload.single('file'), async function(req, res) {
    const id = req.params.id;
    let category_details = req.body;
    if (req.file) {
        console.log(req.file);
        category_details.filename = process.env.IMAGE_URL + '/category/' + req.file.originalname;
        console.log(category_details.filename);
    }
    category_details.updatedon = new Date();

    await Category.updateOne({ _id: id }, {
        $set: category_details
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Category Updated Successfully",
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

Router.get('/category', async function(req, res) {
    await Category.find({ status: { $in: [1, 2] } })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All Category List",
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

Router.get('/category_list', async function(req, res) {
    await Category.find({ status: 1 })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All Category List",
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

Router.get('/category/:id', async function(req, res) {
    const id = req.params.id;
    await Category.find({ _id: id, status: { $in: [1, 2] } })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All Category List By ID",
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

Router.put('/category_delete/:id', async function(req, res) {
    const id = req.params.id;
    await Category.updateOne({ _id: id }, {
        $set: {
            status: 3,
            updatedon: new Date(),
        }
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Category Deleted Successfully",
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

Router.post('/category_action', async function(req, res) {
    var id = req.body.ids;
    var type = req.body.type;

    await Category.updateMany({ status: { $in: [1, 2] }, _id: { $in: id } }, {
        $set: {
            status: (type === 'active' ? 1 : (type === 'inactive' ? 2 : (type === 'delete' ? 3 : ''))),
            updatedon: new Date(),
        }
    }).then((resp) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Category " + (type === 'active' ? 'Active' : (type === 'inactive' ? 'In Active' : (type === 'delete' ? 'Delete' : ''))) + " Successfully !",
        })
    }).catch((resp) => {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Something went wrong ! Please Try Again !",
        })
    })
})

// Category API's End

// SubCategory API's Start
Router.post('/subcategory', subcategory_upload.single('file'), async function(req, res) {
    let subcategory_details = req.body;
    if (req.file) {
        subcategory_details.filename = process.env.IMAGE_URL + '/subcategory/' + req.file.originalname;
    }
    subcategory_details.category_id = null;
    subcategory_details.createdon = new Date();
    subcategory_details.updatedon = null;
    subcategory_details.status = 1;

    let subcategoryDetails = new SubCategory(subcategory_details);
    await subcategoryDetails.save(function(err, data) {
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
                message: "SubCategory Added Successfully",
                token: jwt.sign({ id }, 'sphoenix'),
            })
        }
    })
})

Router.put('/subcategory/:id', subcategory_upload.single('file'), async function(req, res) {
    const id = req.params.id;
    let subcategory_details = req.body;
    if (req.file) {
        subcategory_details.filename = process.env.IMAGE_URL + '/subcategory/' + req.file.originalname;
    }
    subcategory_details.updatedon = new Date();

    await SubCategory.updateOne({ _id: id }, {
        $set: subcategory_details
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "SubCategory Updated Successfully",
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


Router.post('/subcategory_exist', async(req, res) => {
    var data = await SubCategory.findOne({ subcategory: req.body.subcategory, status: { $in: [1, 2] } });
    if (data) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This SubCategory Already Exist, Please Try Again !"
        })
    } else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Category !"
        })
    }
})

Router.put('/subcategory_exist/:id', async(req, res) => {
    var data = await SubCategory.find({ subcategory: req.body.subcategory, _id: { $ne: req.body.id }, status: { $in: [1, 2] } });
    if (data.length != 0) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This SubCategory Already Exist, Please Try Again !"
        })
    } else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Category !"
        })
    }
})

Router.get('/subcategory', async function(req, res) {
    await SubCategory.find({ status: { $in: [1, 2] } })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All SubCategory List",
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

Router.get('/subcategory_list', async function(req, res) {
    await SubCategory.find({ status: 1 })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All SubCategory List",
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

Router.put('/subcategory_sequence/:id', async function(req, res) {
    const id = req.params.id;
    let subcategory_details = req.body;

    var seq_data = await SubCategory.findOne({ sequence: req.body.sequence, status: { $in: [1, 2] } });
    if (seq_data) {
        res.status(200).json({
            status: false,
            statuscode: 200,
            message: "Sequence no doesn't Exist, Please try again !"
        })
    } else {
        await SubCategory.updateOne({ _id: id }, {
            $set: subcategory_details
        }).then((response) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "SubCategory Sequence Successfully",
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
})

Router.get('/subcategory/:id', async function(req, res) {
    const id = req.params.id;
    await SubCategory.find({ _id: id, status: { $in: [1, 2] } })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All SubCategory List By ID",
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

Router.put('/subcategory_delete/:id', async function(req, res) {
    const id = req.params.id;
    await SubCategory.updateOne({ _id: id }, {
        $set: {
            status: 3,
            updatedon: new Date(),
        }
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Sub Category Deleted Successfully",
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

Router.post('/subcategory_action', async function(req, res) {
        var id = req.body.ids;
        var type = req.body.type;

        await SubCategory.updateMany({ status: { $in: [1, 2] }, _id: { $in: id } }, {
            $set: {
                status: (type === 'active' ? 1 : (type === 'inactive' ? 2 : (type === 'delete' ? 3 : ''))),
                updatedon: new Date(),
            }
        }).then((resp) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "Sub Category " + (type === 'active' ? 'Active' : (type === 'inactive' ? 'In Active' : (type === 'delete' ? 'Delete' : ''))) + " Successfully !",
            })
        }).catch((resp) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: "Something went wrong ! Please Try Again !",
            })
        })
    })
    // SubCategory API's End

// PriceList API's Start
Router.post('/pricelist', pricelist_upload.single('file'), async function(req, res) {
    let attach_details = req.body;
    // console.log(attach_details);
    if (req.file) {
        attach_details.filename = process.env.IMAGE_URL + '/PriceLists/' + req.file.originalname;
    }
    attach_details.createdon = new Date();
    attach_details.upd_liatedon = null;
    attach_details.status = 1;

    let attachDetails = new PriceList(attach_details);
    await attachDetails.save(function(err, data) {
        if (err) {
            res.status(409).json({
                statuscode: 409,
                status: false,
                message: err.message
            })
        } else {
            var id = data._id
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "PriceList Added Successfully",
                token: jwt.sign({ id }, 'sphoenix'),
            })
        }
    })
})

Router.put('/pricelist/:id', pricelist_upload.single('file'), async function(req, res) {
    const id = req.params.id;
    let attach_details = req.body;
    if (req.file) {
        attach_details.filename = process.env.IMAGE_URL + '/PriceLists/' + req.file.originalname;
    }
    attach_details.updatedon = new Date();

    await PriceList.updateOne({ _id: id }, {
        $set: attach_details
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "PriceList Updated Successfully",
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


Router.post('/pricelist_exist', async(req, res) => {
    var data = await PriceList.findOne({ title: req.body.title, status: { $in: [1, 2] } });
    if (data) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This PriceList Already Exist, Please Try Again !"
        })
    } else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Category !"
        })
    }
})

Router.put('/pricelist_exist/:id', async(req, res) => {
    var data = await PriceList.find({ title: req.body.title, _id: { $ne: req.body.id }, status: { $in: [1, 2] } });
    if (data.length != 0) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This PriceList Already Exist, Please Try Again !"
        })
    } else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Category !"
        })
    }
})

Router.get('/pricelist', async function(req, res) {
    await PriceList.find({ status: { $in: [1, 2] } }).sort({ createdon: -1 })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All PriceList List",
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

Router.post('/pricelist', async function(req, res) {
    const id = req.body.id;
    await PriceList.find({ _id: id, status: { $in: [1, 2] } })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All PriceList List By ID",
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

Router.put('/pricelist_delete/:id', async function(req, res) {
    const id = req.params.id;
    await PriceList.updateOne({ _id: id }, {
        $set: {
            status: 3,
            updatedon: new Date(),
        }
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "PriceList Deleted Successfully",
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

Router.post('/pricelist_action', async function(req, res) {
    var id = req.body.ids;
    var type = req.body.type;

    await PriceList.updateMany({ status: { $in: [1, 2] }, _id: { $in: id } }, {
        $set: {
            status: (type === 'active' ? 1 : (type === 'inactive' ? 2 : (type === 'delete' ? 3 : ''))),
            updatedon: new Date(),
        }
    }).then((resp) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Price List " + (type === 'active' ? 'Active' : (type === 'inactive' ? 'In Active' : (type === 'delete' ? 'Delete' : ''))) + " Successfully !",
        })
    }).catch((resp) => {
        res.status(400).json({
            statuscode: 400,
            status: false,
            message: "Something went wrong ! Please Try Again !",
        })
    })
})

Router.get('/price_list', async(req, res) => {
        await PriceList.findOne({ status: { $in: [1, 2] } }).sort({ createdon: -1 })
            .then((data) => {
                let response = {}
                response.id = data._id;
                response.title = data.title;
                response.date = data.date;
                response.description = data.description;
                response.status = data.status;
                response.pdfUrl = data.filename;

                res.status(200).json({
                    statuscode: 200,
                    status: true,
                    token: jwt.sign({ response }, 'sphoenix'),
                })
            })
            .catch((resp) => {
                res.status(400).json({
                    statuscode: 400,
                    status: false,
                    message: "Something went wrong ! Please Try Again !",
                })
            })
    })
    // PriceList API's End

// Product API's Start
Router.post('/product_add', product_upload.single('file'), async function(req, res, next) {
    let product_details = req.body;
    console.log(req.body);
    product_details.category = JSON.parse(product_details.category);
    product_details.subcategory = JSON.parse(product_details.subcategory);
    product_details.variant = JSON.parse(product_details.variant);
    product_details.images = JSON.parse(product_details.images);

    product_details.createdon = new Date();
    product_details.updatedon = null;
    product_details.status = 1;

    if (product_details.tracking === 'undefined') {
        product_details.tracking = false;
    }

    if (product_details.minstock === 'undefined') {
        product_details.minstock = 0;
    }

    let productDetails = new Product(product_details);
    await productDetails.save(function(err, data) {
        if (err) {
            res.status(409).json({
                statuscode: 409,
                status: false,
                message: err.message
            })
        } else {
            var id = data._id
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "Product Added Successfully",
                token: jwt.sign({ id }, 'sphoenix'),
            })
        }
    })
})

Router.put('/product', product_upload.single('file'), async function(req, res) {
    const id = req.body.id;
    let product_details = req.body;

    if (product_details.category) {
        product_details.category = JSON.parse(product_details.category);
    }
    if (product_details.subcategory) {
        product_details.subcategory = JSON.parse(product_details.subcategory);
    }
    if (product_details.variant) {
        product_details.variant = JSON.parse(product_details.variant);
    }
    if (product_details.images) {
        product_details.images = JSON.parse(product_details.images);
    }

    product_details.updatedon = new Date();
    product_details.status = product_details.status;

    if (product_details.tracking === 'undefined') {
        product_details.tracking = false;
    }

    if (product_details.minstock === 'undefined') {
        product_details.minstock = 0;
    }


    await Product.updateOne({ _id: id }, {
        $set: product_details
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Product Updated Successfully",
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

Router.post('/product_list', async function(req, res) {
    await Product.find({ status: { $in: [1, 2] } })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "All Product List",
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

Router.post('/get_product', async function(req, res) {
    let ids = req.body.cat_ids.split(',');
    await Product.find({ status: { $in: [1, 2] }, category: { $elemMatch: { value: { $in: ids } } } })
        .then((data) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "Product List",
                token: jwt.sign({ data }, 'sphoenix')
            })
        })
        .catch((err) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: err.message
            });
        })
})

Router.post('/product_cat_sub', async function(req, res) {
    let { cat_ids, sub_ids } = req.body;
    let condition = {}
    let data = [];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var currentDay = days[d.getDay()];

    condition.status = 1

    if (cat_ids.length > 0) {
        condition.category = {
            $elemMatch: {
                value: {
                    $in: cat_ids
                }
            }
        }
    }

    if (sub_ids.length > 0) {
        condition.subcategory = {
            $elemMatch: {
                value: {
                    $in: sub_ids
                }
            }
        }
    }

    let Productdata = await Product.find(condition, { createdon: 0, updatedon: 0, __v: 0 })
    if (Productdata) {
        for (let i = 0; i < Productdata.length; i++) {
            let offerDetails = await Offer.find({
                'offerdaysetting.label': currentDay,
                product: { $elemMatch: { value: { $in: [String(Productdata[i]._id)] } } },
                status: 1,
                $or: [
                    { offerdaysetting: { $elemMatch: { label: { $in: [currentDay] } } } },
                    { validitytype: 1 },
                    { validitytype: { $eq: 2 }, validitydate: { $gte: d } }
                ]
            }, { offerdaysetting: 0, product: 0, category: 0, createdon: 0, updatedon: 0, __v: 0 })
            let offerLength = (offerDetails === undefined) ? 0 : offerDetails.length;
            data.push({
                _id: Productdata[i]._id,
                name: Productdata[i].name,
                description: Productdata[i].description,
                type: Productdata[i].type,
                act_price: Productdata[i].price,
                dis_price: (offerDetails[(offerLength - 1)]) ? Number(Productdata[i].price) - ((Number(Productdata[i].price) * Number(offerDetails[(offerLength - 1)].offervalue / 100))) : 0,
                offer: (offerDetails[(offerLength - 1)]) ? offerDetails[(offerLength - 1)].offervalue : 0,
                packing_cost: Productdata[i].packing_cost,
                tax: Productdata[i].tax,
                taxvalue: Productdata[i].taxvalue,
                totalprice: Productdata[i].totalprice,
                min_qty: Productdata[i].min_qty,
                unit: Productdata[i].unit,
                is_inventory: Productdata[i].is_inventory,
                status: Productdata[i].status,
                tracking: Productdata[i].tracking,
                minstock: Productdata[i].minstock,
                category: Productdata[i].category,
                subcategory: Productdata[i].subcategory,
                images: Productdata[i].images,
                variant: Productdata[i].variant,
                offers: (offerDetails) ? offerDetails : []
            })
        }

        if (data.length > 0)
            res.status(200).json({
                statuscode: 200,
                status: true,
                token: jwt.sign({
                    data
                }, 'sphoenix')
            })
        else
            res.status(200).json({
                statuscode: 200,
                status: false,
                message: 'Product is Empty !!!.'
            })
    } else {
        res.status(200).json({
            statuscode: 200,
            status: false,
            message: 'Product is Empty !!!.'
        })
    }
})

// await Product.find(condition)
//     .then((data) => {
//         res.status(200).json({
//             statuscode: 200,
//             status: true,
//             message: "Product List",
//             token: jwt.sign({ data }, 'sphoenix')
//         })
//     })
//     .catch((err) => {
//         res.status(400).json({
//             statuscode: 400,
//             status: false,
//             message: err.message
//         });
//     })
// })

Router.post('/product_offer', async(req, res) => {
    const { offer_id } = req.body;

    await Offer.aggregate([{
            $addFields: {
                "product.value": {
                    $map: {
                        input: "$product.value",
                        as: "value",
                        in: { $toObjectId: "$$value" }
                    }
                }
            },
        },
        {
            $lookup: {
                from: 'ma_product',
                localField: "product.value",
                foreignField: "_id",
                as: 'products',
            }
        },
        {
            $match: { "_id": ObjectId(offer_id) }
        },
        {
            $project: {
                product: 0,
                createdon: 0,
                updatedon: 0,
                __v: 0
            }
        }
    ]).exec(function(err, data) {
        if (err) {
            res.status(400).json({
                status: false,
                statuscode: 400,
                message: err.message
            })
        } else {
            res.status(200).json({
                status: true,
                statuscode: 200,
                token: jwt.sign({ data }, 'sphoenix')
            })
        }
    })
})

Router.post('/product_list_id', async function(req, res) {
    const id = req.body.id;
    if (id === '')
        return res.status(400).json({
            statuscode: 400,
            status: false,
            message: 'Product id Mandatory !'
        });

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
                "_id": id,
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


                res.status(200).json({
                    status: true,
                    statuscode: 200,
                    token: jwt.sign({
                        data: {
                            _id: data[0]._id,
                            name: data[0].name,
                            description: data[0].description,
                            type: data[0].type,
                            price: data[0].price,
                            act_price: data[0].price,
                            dis_price: (data[0].offers[(offerLength - 1)]) ? Number(data[0].price) - ((Number(data[0].price) * Number(data[0].offers[(offerLength - 1)].offervalue / 100))) : 0,
                            offer: (data[0].offers[(offerLength - 1)]) ? data[0].offers[(offerLength - 1)].offervalue : 0,
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
                    }, 'sphoenix')
                })
            } else {
                let data = await Product.findById(id, {
                    createdon: 0,
                    updatedon: 0,
                    __v: 0
                })

                if (data)
                    res.status(200).json({
                        statuscode: 200,
                        status: true,
                        token: jwt.sign({
                            data: {
                                _id: data._id,
                                name: data.name,
                                description: data.description,
                                type: data.type,
                                price: data.price,
                                act_price: data.price,
                                dis_price: 0,
                                offer: 0,
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
                        }, 'sphoenix')
                    })
                else
                    res.status(200).json({
                        statuscode: 200,
                        status: true,
                        message: 'Product is Empty !!!.'
                    })
            }
        }
    })
})

Router.put('/product_delete/:_id', async function(req, res) {
    const id = req.params._id;
    await Product.updateOne({ _id: id }, {
        $set: {
            status: 3,
            updatedon: new Date(),
        }
    }).then((response) => {
        res.status(200).json({
            statuscode: 200,
            status: true,
            message: "Product Deleted Successfully",
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

Router.post('/product_exist', async(req, res) => {
    var data = await Product.findOne({ name: req.body.name, status: { $in: [1, 2] } });
    if (data) {
        return res.status(200).json({
            status: false,
            statuscode: 200,
            message: "This Product Name Already Exist, Please Try Again !"
        })
    } else {
        return res.status(200).json({
            status: true,
            statuscode: 200,
            message: "Vaild Category !"
        })
    }
})

Router.post('/product_action', async function(req, res) {
        var id = req.body.ids;
        var type = req.body.type;

        await Product.updateMany({ status: { $in: [1, 2] }, _id: { $in: id } }, {
            $set: {
                status: (type === 'active' ? 1 : (type === 'inactive' ? 2 : (type === 'delete' ? 3 : ''))),
                updatedon: new Date(),
            }
        }).then((resp) => {
            res.status(200).json({
                statuscode: 200,
                status: true,
                message: "Product " + (type === 'active' ? 'Active' : (type === 'inactive' ? 'In Active' : (type === 'delete' ? 'Delete' : ''))) + " Successfully !",
            })
        }).catch((resp) => {
            res.status(400).json({
                statuscode: 400,
                status: false,
                message: "Something went wrong ! Please Try Again !",
            })
        })
    })
    // Product API's End

module.exports = Router;