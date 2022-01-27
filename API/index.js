// Third Party Modules
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
var multer = require('multer');
require('dotenv/config')

// routing files declare
var catalog = require('./routes/Catalog')
var user = require('./routes/User')
var master = require('./routes/Master')
var partner = require('./routes/Partner')
var member = require('./routes/Member')
var home = require('./routes/Home')
var order = require('./routes/Order')
var feedback = require('./routes/Feedback');

// body parser
app.use(express.json(true));
app.use(express.urlencoded({ extended: true }));

// cors origin
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// middleware   -- create log file
var accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// routes
app.get('/', (req, res, next) => {
    res.status('200').json('Hello World')
})

app.use('/catalog', catalog)
app.use('/user', user)
app.use('/master', master)
app.use('/partner', partner)
app.use('/member', member)
app.use('/home', home)
app.use('/order', order)
app.use('/feedback', feedback);
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

var upload = multer({
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
}).single("mypic");
// listner
app.listen(process.env.PORT, () => {
    console.log(`Server Starterd on ${process.env.PORT}`);
})
const jwt = require('jsonwebtoken');
app.get('/:id', function(req, res) {
    res.sendFile(path.join(__dirname, "./uploads/" + req.params.id));

});

app.post("/imageupload", async function(req, res, next) {

    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    let image = req.body;
    if (image.image_encode) {

        var string = req.body.image_encode;
        var filename = Date.now() + "_" + req.body.filename;
        let buff = Buffer.from(string, 'base64');
        var appDir = path.dirname(require.main.filename) + "/uploads/";
        if (!fs.existsSync(appDir)) {
            await fs.mkdir(appDir, { recursive: true }, err => {}) // fs.mkdirSync(appDir, 0777);
        }
        var newpath = appDir + '/' + filename;

        fs.writeFile(newpath, buff, function(err) {
            if (err) throw err;
        });
    }




    // upload(req, res, function(err) {
    //     var base = process.env.PWD

    //     if (err) {

    //         // ERROR occured (here it can be occured due
    //         // to uploading image of size greater than
    //         // 1MB or uploading different file type)
    //         res.status(400).json({
    //             statuscode: 400,
    //             status: false,
    //             message: "File not Uploaded",
    //             data: err
    //         })
    //     } else {
    //         var base_path = req.file.path;
    //         // SUCCESS, image successfully uploaded
    //         // res.send("Success, Image uploaded!");
    //         res.status(200).json({
    //             statuscode: 200,
    //             status: true,
    //             message: "File Uploaded",
    //             token: jwt.sign({
    //                 link: base_path
    //             }, 'sphoenix')
    //         })
    //     }
    // })
})

// DB Connection
mongoose.set('useNewUrlParser', true)
    // mongoose.set('debug', true);
mongoose.set('useUnifiedTopology', true)
    // var url = "mongodb+srv://mequals_taskterra:Welcome123@@taskterra.ouaus.mongodb.net/miami_booking_dub";

// mongoose.connect(url, function(err, db) {
//     if (err) throw err;
//     console.log("Database created!");
// db.close();
// });

var MongoClient = require('mongodb').MongoClient;


var url = 'mongodb+srv://mequals_taskterra:Welcome123@@taskterra.ouaus.mongodb.net';
var dbName = 'miami_booking';
MongoClient.connect("mongodb+srv://mequals_taskterra:Welcome123@@taskterra.ouaus.mongodb.net/", { useUnifiedTopology: true, useNewUrlParser: true, poolSize: 5, reconnectInterval: 500 },
    async function(err, client) {
        //console.log("DATABASE IS BEING LOGGED...." ,client);
        var dbAdmin = client.db(dbName);
        var mongoCommand = { copydb: 1, fromhost: "mongodb+srv://mequals_taskterra:Welcome123@@taskterra.ouaus.mongodb.net", fromdb: "miami_booking", todb: "test_dup" };

        await dbAdmin.command(mongoCommand, function(commandErr, data) {
            if (!commandErr) {
                console.log(data);
            } else {
                console.log(commandErr.errmsg);
            }
            // db.close();
        });
    });

// MongoClient.connect(url, function(err, db) {
//     if (err) {
//         console.log(err);
//     } else {

//         var mongoCommand = { copydb: 1, fromhost: "mongodb+srv://mequals_taskterra:Welcome123@@taskterra.ouaus.mongodb.net", fromdb: "miami_booking", todb: "test_dup" };
//         var admin = db.admin();

//         admin.command(mongoCommand, function(commandErr, data) {
//             if (!commandErr) {
//                 console.log(data);
//             } else {
//                 console.log(commandErr.errmsg);
//             }
//             db.close();
//         });
//     }
// });




// mongoose.connect(process.env.DATABASE_CONNECTION, () => {
//     console.log('Database Connected');
// });