var AWS = require('aws-sdk');
var fs = require('fs');
var zlib = require('zlib');
var tar = require('tar-fs');
var path = require('path');
var request = require('request')
var readdirp = require('readdirp')
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
// file = path.join(file, 'LICENSE')
json = path.join(__dirname, 'package.json')

// module.exports = function (path, dest) {
// 	var body = tar.pack(path).pipe(zlib.createGzip())
// 	var s3obj = new AWS.S3({params: {Bucket: 'nghiattran', Key: dest + '.tgz'}});
// 	s3obj.upload({Body: body}).
// 	  on('httpUploadProgress', function(evt) { 
// 	  	console.log(evt); 
// 	  }).
// 	  send(function(err, data) { 
// 	  	console.log(err, data) 
// 	  });
// }

function upload (pathTo) {
  // var body = tar.pack(pathTo).pipe(zlib.createGzip())
  var bowerPath = path.join(__dirname, 'bower_components')
  // bower = tar.pack(bower)
  // bower = bower.pipe(zlib.createGzip())
  var stream = readdirp({ root: bowerPath})
  // json = fs.createReadStream(json)
  //   .pipe(zlib.createGzip());

  console.log(stream)
  var formData = {
    'package': stream
  }  
  // console.log(formData)
  
  var r = doUpload()

  // var form = r.form()
  // form.append('my_file', body)
  // form.append('json', json)
  // form.append('package', bower)
  // form.append('package', stream)
  // console.log(form)
}

function doUpload (formData) {
  var headers = {
    'Content-encoding': 'gzip'
  }
  return request.post({url:'http://localhost:9000/package', formData:formData, headers:headers}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
  })
}

upload(file)