/*jshint sub:true*/
var https = require('http'),
    express = require('express'),
    lti = require('ims-lti'),
    // _ = require('lodash'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express(),
    exphbs = require('express-handlebars'),
    hbs = exphbs.create({ /* config */ }),

    ltiKey = "12345",
    ltiSecret = "secret";

const port = 3000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.engine('hbs', hbs.engine);
// Template engine to use
app.set('view engine', 'hbs');

//Setup a POST endpoint to take anything going to /launch_lti  
app.post('/launch_lti', function (req, res, next) {

    // req.body = _.omit(req.body, '__proto__');    

    if (req.body['oauth_consumer_key'] === ltiKey) {
        var provider = new lti.Provider(ltiKey, ltiSecret);

        //Check is the Oauth  is valid using the LTI plugin for NodeJS.         
        provider.valid_request(req, function (err, isValid) {
            if (err) {
                console.log('Error in LTI Launch:' + err);
                res.status(403).send(err);

            } else {
                if (!isValid) {
                    console.log('\nError: Invalid LTI launch.');
                    res.status(500).send({
                        error: "Invalid LTI launch"
                    });
                } else {
                    //User is Auth so pass back when ever we need. in this case we use pug to render the values to screen  
                    res.render('launch.hbs', {
                        title: 'LTI SETTINGS',
                        userID: req.body['user_id'],
                        userRole: req.body['roles'],
                        fullLog: JSON.stringify(req.body)
                    }, function (err, html) {
                        if (err) {
                            console.log(err);
                        }
                        res.status(200).send(html);
                    });

                }
            }
        });
    } else {
        console.log('LTI KEY NOT MATCHED:');
        res.status(403).send({
            error: "LTI KEY NOT MATCHED"
        });
    }

});

app.get("/", function (req, res) {
    res.sendFile("index.html", {
        root: path.join(__dirname)
    });
});

/*  Setup the http server, When delyed locally this will run on port 5000, when deployed on Heroku it will assign a port and add SSL  
    Default hostname is 127.0.0.0(localhost). Set Host name as 0.0.0.0 when you want to access the app from another web application or computer.
    To access this application use the IP address of machine running NodeJS app and port (Eg. 192.168.5.6:3000)
*/
var server = https.createServer(app).listen(port, '0.0.0.0', function () {
    console.log("https server started. Server is running on port " + port);
});