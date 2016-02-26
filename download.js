'use strict';

var fs = require('fs-extra');
var request = require('request');
var zlib = require('zlib');
var gzip = zlib.createGzip();
var tar = require('tar');
var path = require('path');

module.exports = function (url, opts, cb){
  if (typeof opts === 'function') { 
    cb = opts;
    opts = {};
  } else {
    cb = cb || function () {};
    opts = opts || {};
  }

  if (opts.ext) {
    return downloadExtract(url, opts, cb);
  } else {
    return download(url, opts, cb);
  }
}

function downloadExtract (url, opts, cb){
  var dest = opts.dest || path.parse(url).name;
  var stream =  request.get(url);

  stream
    .on('response', function(res) {
      if (res.statusCode != 200) {
        var res = path.basename(url) + ' has been extracted to ' + dest  +  '.';
        streamError(stream, res, cb);
      } else {
        stream
          .pipe(zlib.Unzip())
          .on('error', function(err){
            cb(err, undefined);
          })
          .pipe(tar.Extract( {path: dest}))
          .on('finish', function(){
            var res = path.basename(url) + ' has been extracted to ' + dest  +  '.';
            cb(undefined, {status: res});
          })
      }
    })
}

function download (url, opts, cb){
  var dest = opts.dest || path.basename(url);
  var stream = request(url)
  stream
    .on('response', function (res) {
      if (res.statusCode != 200) {
        var res = path.basename(url) + ' has been extracted to ' + dest  +  '.';
        streamError(stream, res, cb);
      } else {
        stream
          .pipe(fs.createOutputStream(dest))
          .on('finish', function (){
            var res = path.basename(url) + ' has been downloaded to ' + dest  +  '.';
            cb(undefined, {status: res});
          })
      }
    }) 
}

function streamError (stream, err, cb) {
  stream
    .on('end', function () {
      cb(err, undefined);
    })
}