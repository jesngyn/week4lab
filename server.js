let express = require('express');
let app = express();

let db = [];

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('images'));
app.use(express.static('css'));
app.use(express.static('views'));

let bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/addtask', function (req, res) {
    db.push({
        taskname: req.body.taskname,
        taskdue: req.body.taskdue,
        taskdesc: req.body.taskdesc
    });
    console.log(req.body.taskname);
    console.log(req.body.taskdue);
    console.log(req.body.taskdesc);
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/listall', function(req, res) {
    res.render("listtask", {tasks: db});
    console.log(db);
});

app.listen(8080);
console.log('running!');