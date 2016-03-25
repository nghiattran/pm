'use strict';

var http = require('http')
var semver = require('semver')
var fs = require('fs')

module.exports = class GetPkg {
  // this.baseUrl = 'http://registry.npmjs.org/'

  static http (name, cb) {
    var baseUrl = 'registry.npmjs.org'
    cb = cb || function () {}
    var data = ''
    var options = {
      hostname: baseUrl,
      path: ('/' + name)
    }
    var self = this
    http.get(options, function (res) {
      if (res.statusCode !== 200) {
        cb(res.statusCode, undefined);
      }
      var data = '';
      res
        .setEncoding('utf8')
        .on('data', function (chunk) {
          data += chunk;
        })
        .on('end', function (){
          try{
            data = JSON.parse(data);
            // self.version = semver.maxSatisfying(Object.keys(data.versions), self.version)
            // self.setPkg(data.versions[self.version])
            cb(undefined, data);
          } catch(err) {
            cb(err, undefined);
          }
        })
    })
  }

  static packageJson (cb) {
    var pathToJson = 'test.json';
    try {
      var data = fs.readFileSync(pathToJson);
      try{
        data = JSON.parse(data);
        // this.setPkg(data);
        cb(undefined, data);
      } catch (err) {
        cb(err, undefined);
      }
    } catch (err) {
      cb(err, undefined);
    }
  }
}