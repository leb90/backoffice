var UserModel = require('../models/user');
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var nodemailer = require('nodemailer');
var fs = require('fs');
var cookieParser = require('cookie-parser')
var cron = require('node-cron');
var expires = require('expires');


var userToken = [];
var timestamp = expires.after('2 days');

// Setup once
var options = {
    weekday: 'long',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
},
intlDate = new Intl.DateTimeFormat( undefined, options );





router.get('/test', function (req, res) {
console.log( intlDate.format(timestamp) );

});

router.get("/user/:id", function (req, res) {

    var id = req.params.id;

    if (id !== undefined) {
        UserModel.getUser(id, function (error, data) {

            if (data !== undefined && data.length > 0) {
                res.json(200, data);
            } else {
                res.json(404, {
                    "msg": "notExist"
                });
            }
        });
    } else {
        res.status(500);
        res.json({
            "msg": "Error"
        });
    }
});

router.post("/user", function (req, res) {
    var userData = {

        user_name: req.body.user_name,
        email: req.body.email,
        level: req.body.level,
        phone: req.body.phone,
        password: req.body.password,
        status_id: req.body.status_id,

    };

    userData.password = crypto.createHash('md5').update(userData.password).digest('hex');

    UserModel.insertUser(userData, function (error, data) {


        if (data && data.msg) {
            res.send(data);
        } else {
            res.status(500);
            res.json({
                "msg": "Error"
            });
        }
    });
});


router.get('/login', function (req, res, next) {

    res.render('login');
});


router.post('/login', function (req, res, next) {

    var userData = {

        user_name: req.body.user_name,
        password: req.body.password
    };

    var hash = crypto.createHash('md5').update(userData.password).digest('hex');

    userData.password = hash;


    UserModel.getLogUser(userData, function (error, user) {
        if (error) {
            return
            res.status(500)
            res.json({
                "msg": "Error"
            });

        }
        if (!user.length) {
            res.status(500)
            res.send({
                "msg": "Error"
            });

        } else {
          //  var token = tokenHelper.generateToken();
//pasar a funcion helper
            var tokenData = {
                user_id: user[0].id,
                tokens: [{
                    token: crypto.randomBytes(16).toString('hex'),
                    expiration_date: intlDate.format(timestamp)
                }]
            }

            // var obj = _.find(userToken, function (o) {
            //     return o && o.user_id == user[0].id;
            // })

            // if (obj) {
            //     obj.tokens.push(token);
            // }
            // else {
            //     var asd = {
            //         user_id: user[0].id,
            //         tokens: [token]
            //     };
            // }



         //   var tokenData = {
           //     user_id: user[0].id,
             //   tokens: [{
               //     token: crypto.randomBytes(16).toString('hex'),
                 //   expiration_date: intlDate.format(timestamp)
               // }]
           // };

          //  obj.tokens.push(token);

            userToken.push(tokenData);

            res.send({
                token: tokenData,
                msj: 'Sign In',
            });
            console.log(userToken)
        }

    });
});



module.exports = router