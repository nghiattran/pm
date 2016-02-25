var AWS = require('aws-sdk');
var fs = require('fs');
var zlib = require('zlib');
var tar = require('tar-fs');
var path = require('path');
/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 *
 * export AWS_ACCESS_KEY_ID='AKID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */

AWS.config.region = 'us-east-1';
AWS.config.accessKeyId = 'AKIAIP7BTRORX4S76QIA';
AWS.config.secretAccessKey = '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';

var file = __dirname;
var fileName = path.basename(__dirname);


module.exports = function (path, dest) {
	var body = tar.pack(path).pipe(zlib.createGzip())
	var s3obj = new AWS.S3({params: {Bucket: 'nghiattran', Key: dest + '.tgz'}});
	s3obj.upload({Body: body}).
	  on('httpUploadProgress', function(evt) { 
	  	console.log(evt); 
	  }).
	  send(function(err, data) { 
	  	console.log(err, data) 
	  });
}