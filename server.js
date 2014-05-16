var express = require('express'),
    stylus = require('stylus'),
    mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

var compileFn = function (str, path) {
    return stylus(str).set('filename', path);
};

app.configure(function () {
    app.set('views', __dirname + '/server/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(stylus.middleware(
        {
        src: __dirname + '/public',
        compile: compileFn
        }
    ));

    // static routing, so any request for static resources like CSS, images, will be sent to the public folder.
    app.use(express.static(__dirname + '/public'));
});

//////////////////////////////////////////////////////
// sexy db stuff....

//mongoose.connect('mongodb://localhost/multivision');
mongoose.connect('mongodb://bdabuilder:multivision@ds043329.mongolab.com:43329/test23100');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
    console.log('multivision db opened');
});

var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);

var mongoMessage;

// get first record and assign it to mongoMessage. We use the mongoMessage variable further down...
Message.findOne().exec(function (err, messageDoc) {
    mongoMessage = messageDoc.message;
});

// end of sexy db stuff
//////////////////////////////////////////////////////

app.get('/partials/:partialPath', function (req, res) {
    res.render('partials/' + req.params.partialPath);
});

app.get('*', function (req, res) {
    res.render('index', {
        mongoMessage: mongoMessage
    });
});

var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listening on port ' + port + '...');
