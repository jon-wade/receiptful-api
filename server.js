var unirest = require('unirest');
var express = require('express');
var bodyParser = require('body-parser');
var key = require('./key.js');

var app = express();
var jsonParser = bodyParser.json();

//this serves all the static assets
app.use(express.static(__dirname + '/public'));

app.post('/send', jsonParser, function(req, res) {

    console.log(req.body.toEmail);
    console.log(req.body.fromEmail);

    var toEmail = req.body.toEmail;
    var fromEmail = req.body.fromEmail;
    var message = req.body.message;
    var apiKey = key.get();

    // send a receipt
    unirest.post('https://app.receiptful.com/api/v1/receipts')
        .headers({
            "X-ApiKey": apiKey,
            "Content-Type": "application/json"
        })
        .send({
            "reference": "Test Reference",
            "currency": "GBP",
            "amount": "999",
            "amountNotes" : "including VAT",
            "to": toEmail,
            "from": fromEmail,
            "payment": {
                "type": "VISA",
                "last4": 9999
            },
            "items": [{
                "description": message,
                "amount": "999",
                "url": "http://jonwade.codes"}]
        })
        .end(function(response, reject) {
            if (reject) {
                console.log('reject.statusCode=', reject.statusCode);
                res.status(404).send({status: response.status, statusCode: response.statusCode, to: response.body.to, from: response.body.from});
            }
            console.log('response', response.body.to, response.body.from);
            res.status(200).send({status: response.status, statusCode: response.statusCode, to: response.body.to, from: response.body.from});
        });
});

//this sends request for endpoints that don't exist back to angular for routing (as well as dealing with error pages)
app.get('*', function(req, res) {
    res.sendFile('index.html', {root: __dirname + '/public/'});
});


if(!module.parent) {
    app.listen(8080);
    console.log("App is listening on port 8080");
}

exports.app = app;