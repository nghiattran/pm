"use strict";
var fs = require('fs');
var zlib = require('zlib');
var tar = require('tar-fs');
var path = require('path');
var request = require('request');
var rimraf = require('rimraf');
var UPLOAD_URL = 'http://52.91.199.8/api/package';
var BASE_DIR = __dirname;
var tempDir = '.tmp';
var tempGzipFile = 'tmp.tgz';
/**
 * fromPath: path to base pkg
 */
function upload(fromPath) {
    var form = JSON.parse(fs.readFileSync(path.join(fromPath, 'test.json')));
    // TODO: This should a json file
    var json = fs.createReadStream(path.join(fromPath, 'test.json'));
    compress(fromPath, function (toPath) {
        var pkg = fs.createReadStream(path.join(toPath, tempGzipFile));
        var formData = {
            json: json,
            package: pkg
        };
        console.log(form);
        doUpload(formData, form);
        rimraf(toPath, function (err) {
            if (err)
                throw err;
            console.log('successfully deleted ' + toPath);
        });
    });
}
function compress(fromPath, cb) {
    var toPath = path.join(fromPath, tempDir);
    var tempFile = path.join(toPath, tempGzipFile);
    var ignoreFiles = readIgnoreFile(fromPath);
    if (!fs.existsSync(toPath)) {
        fs.mkdirSync(toPath);
    }
    // TODO: ignore globs
    var stream = tar.pack(fromPath, { ignore: function (name) {
            for (var i = 0; i < ignoreFiles.length; i++) {
                if (path.join(fromPath, ignoreFiles[i]) === name) {
                    return true;
                }
            }
            return false;
        } });
    stream.pipe(zlib.createGzip())
        .pipe(fs.createWriteStream(tempFile))
        .on('finish', function () {
        console.log(tempFile);
        cb(toPath);
    });
}
/**
 * Read in .pkgignore from root directory
 */
function readIgnoreFile(fromPath) {
    try {
        var content = fs.readFileSync(path.join(fromPath, '.pkgignore'), 'utf8');
        var array = content.split('\n');
        return array;
    }
    catch (e) {
        return e;
    }
}
/**
 * Perfom upload
 */
function doUpload(formData, form) {
    var pkg = {
        name: form.name,
        version: form.version,
        author: form.author,
        private: form.private,
        json: form
    };
    var options = {
        url: UPLOAD_URL,
        formData: formData,
        qs: pkg,
        headers: {
            'Content-encoding': 'gzip',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    return request.post(options, function (err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
    });
}
upload(BASE_DIR);
