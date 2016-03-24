"use strict";
var fs = require('fs');
var zlib = require('zlib');
var tar = require('tar-fs');
var path = require('path');
var request = require('request');
var rimraf = require('rimraf');
var file = __dirname;
var tempDir = '.tmp';
var tempGzipFile = 'tmp.tgz';
function upload(toPath) {
    // console.log(toPath)
    var json = fs.createReadStream(path.join(toPath, 'index.js'));
    compress(toPath, function (toPath) {
        // console.log(toPath)
        var pkg = fs.createReadStream(path.join(toPath, tempGzipFile));
        var formData = {
            pkg: pkg,
            json: json
        };
        doUpload(formData);
        rimraf(toPath, function (err) {
            if (err)
                throw err;
            console.log('successfully deleted ' + toPath);
        });
    });
}
function compress(toPath, cb) {
    var temp = path.join(toPath, tempDir);
    var tempFile = path.join(temp, tempGzipFile);
    if (!fs.existsSync(temp)) {
        fs.mkdirSync(temp);
    }
    tar.pack(toPath)
        .pipe(zlib.createGzip())
        .pipe(fs.createWriteStream(tempFile))
        .on('finish', function () {
        console.log('end');
        cb(temp);
    });
}
function doUpload(formData) {
    var headers = {
        'Content-encoding': 'gzip'
    };
    return request.post({ url: 'http://localhost:9000/package', formData: formData, headers: headers }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
    });
}
upload(file);
