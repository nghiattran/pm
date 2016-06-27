var express = require('express');
var app = express();
var multer  = require('multer');
var utils = require('./utils');
var path = require('path');
// var upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
  	var names = file.originalname.split('.');
  	var folder = utils.hashName(names[0]);
  	console.log(path.join(folder, file.originalname));
    cb(null, path.join(folder, file.originalname));
  }
})

var upload = multer({ storage: storage })


app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.post('/profile', upload.single('gzip'), function (req, res, next) {
	console.log('there')
	// req.file is the `avatar` file
	// req.body will hold the text fields, if there were any
	console.log(req.file)
	res.status(204).end();
})


app.listen(9000, function () {
	console.log('hello')
})