'use strict';

var http = require('http')
var semver = require('semver')

module.exports = class GetPkg {
  static http (cb) {
    cb = cb || function () {}
    var data = ''
    var options = {
      hostname: this.baseUrl,
      path: ('/' + this.name)
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
            self.version = semver.maxSatisfying(Object.keys(data.versions), self.version)
            self.setPkg(data.versions[self.version])
            cb(undefined, data);
          } catch(err) {
            cb(err, undefined);
          }
        })
    })
  }

  static packageJson (pathToJson) {
    pathToJson = pathToJson || 'test.json';
    try {
      var data = fs.readFileSync(pathToJson);
      try{
        data = JSON.parse(data);
        this.setPkg(data);
      } catch (err) {
        console.error(err)
      }
    } catch (err) {
      console.error('Can\'t read package.json of ' + this.fullName)
      console.error(err)
    }
  }
}