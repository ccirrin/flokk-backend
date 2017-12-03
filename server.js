/*  Imports express module. This is the 
    framework that allows us to do all of the 
    routing to our endpoints and handle requests
    and responses easily
*/
var express = require("express");
// This constructs the "express" app.
var app = express();
/*  There could be an env varialble PORT, so this
    checks for it before setting it to 5000
*/
var port = process.env.PORT || 5000;
// Allows us to parse requests and responses to json
var bodyParser = require('body-parser');
/*  Allows other domains across the web to access
    our server
*/
var cors = require('cors');
// Makes the express app use cors
app.use(cors());
// Makes the app use the body parser for json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Import mongoose. This is an extended mongodb
    helper that allows us to create schemas for the 
    db. Also allows us to use mongodb functions.
*/
var mongoose = require("mongoose");

/* Connect to mongoose, to our mongodb sandbox,
    which is hosted somewhere else.
*/
mongoose.connect("mongodb://kohanian:flokk222@ds237735.mlab.com:37735/flokk-db",
    { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected");
});


/* Schema creation. Not necessarily required,
    but it allows consistency and helps us easily
    do CRUD operation. Like a class declaration
*/
var eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    time: String,
    location: String,
    email: String,
    latitude: Number,
    longitude: Number
    
});
/* Referencing the Event collection, and attaching
    a schema to that collection
*/
var Event = mongoose.model("Event", eventSchema);


// base url get endpoint
app.get("/", (req, res) => {
    // Sending back a response that says "Hello World"
    return res.send("Hello World");
});

// Get list of all events 
app.get("/events", (req, res) => {
    /* Inside of the "Event" collection, 
        find based off of query passed in.
    */
    Event.find(function(err, events){
        if(err){
            // Pass 500 status code if there is an error
          return res.status(500).json({message: "error"});
        } else{
            // Pass 200 and send the list of events in json.
            return res.status(200).send(events);
        }
    })
});

// POST method to create event
app.post("/events/create", (req, res) => {
    // create new schema from the request body passed in
    var newEvent = new Event(req.body);
    // From "Event" schema, pass in our new event.
    Event.create(newEvent, function (err, result) {
        if (err) {
            return res.status(500).json({message: "error"});
        }
        else {
            return res.status(200).json({message: "success"});
        }
    })
});
// POST method to update
app.post("/events/update", (req, res) => {
    var thisEvent = new Event(req.body);
    Event.findById(thisEvent._id, function (err, eventObj) {
        if (err) {
            return res.json({message: "error"});
        }
        else {
            eventObj.set(thisEvent);
            eventObj.save(function(err, updatedEvent) {
                if (err) {
                    return res.status(500).json({message: "error"});
                }
                else {
                    return res.status(200).json({message: "success"});
                }
            });
        }
    });
});

app.post("/events/delete", (req, res) => {
    Event.remove({"_id": req.body._id}, function (err, result) {
        if (err) {
            return res.status(500).json({message: "error"});
        }
        else {
            return res.status(200).json({message: "success"});
        }
    })
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
