import * as AWS from 'aws-sdk'
import * as fs from 'fs'
import * as zlib from 'zlib'
import * as tar from 'tar-fs'
import * as path from 'path'
import * as request from 'request'
import * as readdirp from 'readdirp'
import * as rimraf from 'rimraf'

const file = __dirname
const tempDir = '.tmp'
const tempGzipFile = 'tmp.tgz'

function upload(toPath) {
  // console.log(toPath)
  const json = fs.createReadStream(path.join(toPath, 'index.js'))
  compress(toPath, function(toPath) {
    // console.log(toPath)
    const pkg = fs.createReadStream(path.join(toPath, tempGzipFile))
    const formData = {
      pkg,
      json
    }
    doUpload(formData)
    rimraf(toPath, (err) => {
      if (err) throw err;
      console.log('successfully deleted ' + toPath);
    });
  })
}

function compress(toPath, cb) {
  const temp = path.join(toPath, tempDir)
  const tempFile = path.join(temp, tempGzipFile)
  if (!fs.existsSync(temp) ){
    fs.mkdirSync(temp);
  }
  tar.pack(toPath)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(tempFile))
    .on('finish', function () {
      console.log('end')
      cb(temp)
    })
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
