'use strict';

var fs = require('fs');
var request = require('request');
var zlib = require('zlib');
var gzip = zlib.createGzip();
var tar = require('tar');
var path = require('path');

module.exports = function (url, opts, cb){
	if (opts.ext) {
		return downloadExtract(url, opts, cb);
	} else {
		return download(url, opts, cb);
	}
}

function downloadExtract (url, opts, cb){
	var dest = opts.dest || path.parse(url).name;
	return request.get(url)
		.on('response', function(res) {
	    if (res.statusCode != 200) {
	    	var err = 'Something went wrong. Status code ' + res.statusCode;
	    	cb(err);
	    }
	  })
		.pipe(zlib.Unzip())
		.pipe(tar.Extract( {path: dest}))
		.on('error', (err) => {
			throw err;
		})
		.on('end', () =>{
			console.log(path.basename(url) + ' has been extracted to ' + dest  +  '.')
			cb(err, 'saved');
		})
}

function download (url, opts, cb){
	var dest = opts.dest || path.basename(url);
	return request(url)
		.on('response', function(res) {
	    if (res.statusCode != 200) {
	    	var err = 'Something went wrong. Status code ' + res.statusCode;
	    	cb(err);
	    }
	  })
		.pipe(fs.createWriteStream(dest))
		.on('end', () =>{
			console.log(path.basename(url) + ' has been downloaded to ' + dest  +  '.')
			cb(err, 'saved');
		})
}

// defaultFunc('http://registry.npmjs.org/version-checker/-/version-checker-0.1.5.tgz', {ext: true})