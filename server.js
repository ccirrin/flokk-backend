var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.connect("mongodb://kohanian:flokk222@ds237735.mlab.com:37735/flokk-db",
    { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected");
});
var eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    location: String
});
var Event = mongoose.model("Event", eventSchema);


app.get("/", (req, res) => {
    return res.send("Hello World");
});


app.get("/events", (req, res) => {
    Event.find(function(err, events){
        if(err){
          return res.status(500).json({message: "error"});
        } else{
            return res.status(200).send(events);
        }
    })
});

app.post("/events/create", (req, res) => {
    var newEvent = new Event(req.body);
    Event.create(newEvent, function (err, result) {
        if (err) {
            return res.status(500).json({message: "error"});
        }
        else {
            return res.status(200).json({message: "success"});
        }
    })
});

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
