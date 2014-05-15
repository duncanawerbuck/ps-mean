var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

app.configure(function () {
    app.set('views', __dirname + '/server/views');
    app.set('view engine', 'jase');
});

app.get('*', function (req, res) {
    res.render('index'); //TODO: Create view ("Creating the Node Application" @ 04:55)
});