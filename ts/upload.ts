import * as AWS from 'aws-sdk'
import * as fs from 'fs'
import * as zlib from 'zlib'
import * as tar from 'tar-fs'
import * as path from 'path'
import * as request from 'request'
import * as readdirp from 'readdirp'
import * as rimraf from 'rimraf'
import * as isGlob from 'isGlob'

const UPLOAD_URL = 'http://localhost:9000/api/package'

const BASE_DIR = __dirname
const tempDir = '.tmp'
const tempGzipFile = 'tmp.tgz'

/**
 * fromPath: path to base pkg
 */

function upload(fromPath) {
  const form = JSON.parse(fs.readFileSync(path.join(fromPath, 'test.json')))  
  // TODO: This should a json file
  const json = fs.createReadStream(path.join(fromPath, 'test.json'))
  compress(fromPath, function(toPath) {
    const pkg = fs.createReadStream(path.join(toPath, tempGzipFile))
    const formData = {
      json,
      package:pkg,
    }
    doUpload(formData, form);
    rimraf(toPath, (err) => {
      if (err) throw err;
      console.log('successfully deleted ' + toPath);
    });
  })
}

function compress(fromPath, cb) {
  const toPath = path.join(fromPath, tempDir)
  const tempFile = path.join(toPath, tempGzipFile)
  const ignoreFiles = readIgnoreFile(fromPath)

  if (!fs.existsSync(toPath)){
    fs.mkdirSync(toPath);
  }

  // TODO: ignore globs
  let stream = tar.pack(fromPath, { ignore: function (name) {
    for (var i = 0; i < ignoreFiles.length; i++) {
      if (path.join(fromPath, ignoreFiles[i]) === name) {
        return true
      }
    }

    return false
  }})
    
  stream.pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(tempFile))
    .on('finish', function () {
      console.log(tempFile)
      cb(toPath)
    })
}

/**
 * Read in .pkgignore from root directory
 */
function readIgnoreFile(fromPath) {
  try {
    const content = fs.readFileSync(path.join(fromPath,'.pkgignore'), 'utf8')
    const array = content.split('\n')
    return array
  } catch (e) {
    return e
  }
}


/**
 * Perfom upload
 */
function doUpload (formData, form) {
  var pkg = {
    name: form.name,
    version: form.version,
    author: form.author,
    private: form.private,
    json: form
  };

  var options = {
    url: UPLOAD_URL, 
    formData:formData, 
    qs: pkg,
    headers: { 
      'Content-encoding': 'gzip',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
}

return request.post(options, function(err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
  })
}


upload(BASE_DIR)
