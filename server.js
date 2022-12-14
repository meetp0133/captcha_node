const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    request = require('request');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var port = 4000;

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/captcha', function(req, res) {
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
    {
        return res.json({"responseError" : "Please select captcha first"});
    }
    const secretKey = "6Ldv930iAAAAAACz8MNA7Of4vRH9Pqs-K8Vr95xr";

    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL,function(error,response,body) {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success) {
            console.log("success")
            return res.json({"responseError" : "Failed captcha verification"});
        }
        console.log("success")
        res.json({"responseSuccess" : "Success"});
    });
});

app.listen(port, function(){
    console.log('Server is running at port: ',port);
});