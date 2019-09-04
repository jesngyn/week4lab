const express = require("express");
const mongodb = require("mongodb");
const bodyparser = require('body-parser');
const morgan = require('morgan');

//Configure Express
const app = express()

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('images'));
app.use(express.static('css'));
app.use(express.static('views'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('common'));

//Configure MongoDB
const MongoClient = mongodb.MongoClient;

// Connection URL
const url = "mongodb://localhost:27017/";

//reference to the database (i.e. collection)
let db;

//Connect to mongoDB server
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("week5db");
        }
    });


//---- Route Handlers

//index
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

//add task POST req
app.post('/addtask', function (req, res) {
    let taskDetails = req.body;
    //generate random ID to whole number
    //source: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    let randId = Math.floor(Math.random() * (19999 - 10000 + 1)) + 10000;
    db.collection('tasks').insertOne({
        taskid: randId,
        name: taskDetails.taskname,
        assignedto: taskDetails.taskassign,
        duedate: taskDetails.taskdue,
        taskstatus: taskDetails.taskstatus,
        description: taskDetails.taskdesc
    });
    res.redirect('/listall');
});

//list all GET req
app.get('/listall', function(req, res) {
    db.collection('tasks').find({}).toArray(function (err, data) {
        res.render("listtask", {tasks: data});
    });
});

app.post('/deletetaskbyid', function (req, res){
    let taskDetails = req.body;
    let filter = { taskid: taskDetails.taskid };
    db.collection('tasks').deleteOne(filter);
    res.redirect('/listall');
});

app.listen(8080);
console.log('running!');