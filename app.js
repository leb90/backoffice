global.ConfigServer = require('../configServer.json');
var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var cookieParser = require('cookie-parser')
var router_user = require('./routes/router_user');
var http = require('http');
var app = express();
var path = require("path");
var router = express.Router();
var connection = require('./models/connection');
var fs = require('fs');

app = express();
app.use(cookieParser());


app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hogan-express'));

app.use(function(req, res, next) {
    var oneof = false;
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization, Content-Type, Accept, Origin");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }
    if (req.method == 'OPTIONS')
        res.status(200).send();
    else
        next();
});

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

////////////Validation





app.use(express.static(path.join(__dirname, '/public')));


//app.use("/", routesIndex);
app.use("/", router_user);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;