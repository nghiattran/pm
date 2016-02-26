'use strict';

var path = require('path');
var download = require('my-wget');
var packageJson = require('package-json');

module.exports = class pkg {
// class pkg {
	constructor (name, version) {
		var self = this;
		self.name = name;
		self.version = version;
		self.fullName = self.name + '-' + self.version;
		self.file = self.fullName + '.tgz';
		packageJson(name, version).then(function (json) {
			console.log(json);
		});
	}

	download (toDir, cb) {
		toDir = toDir || '';
		cb = cb || function (){};
		var self = this;
		var dest = path.join(__dirname, toDir, this.fullName);
		var opts ={
			ext: true,
			dest: dest
		}

		this.downloadMod(opts, function (err, res) {
			if (err) {
				self.downloadNpm(opts, function (err, res) {
					if (err) {
						return cb(self.fullName + ' not found.', undefined);
					}
					return cb(undefined, 'Downloaded from npm');
				});
			} else {
				return cb(undefined, 'Downloaded from module');
			}
		})
	}

	downloadNpm (opts, cb) {
		var url = 'http://registry.npmjs.org/' + this.name + '/-/' + this.file;
		return download(url, opts, cb);
	}

	downloadMod (opts, cb) {
		var url = 'https://s3.amazonaws.com/nghiattran/' + this.file;
		return download(url, opts, cb);
	}
}

// var aPkg = new pkg('version-checker', '0.0.24');

// aPkg.download();