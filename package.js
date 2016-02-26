'use strict';

var path = require('path');
var download = require('my-wget');
var packageJson = require('package-json');
var getVer = require('get-ver');
var fs = require('fs');


module.exports = class pkg {
// class pkg {
	constructor (name, version) {
		this.name = name;
		this.version = version;
	}

	getVerion (cb){
		var self = this;
		getVer(this.name, this.version).then(function (version) {
			self.version = version;
			self.fullName = self.name + '-' + self.version;
			self.file = self.fullName + '.tgz';
			cb();
		});
	}

	download (toDir, cb) {
		this.toDir = toDir || '';
		cb = cb || function (){};
		this.getVerion(function () {
			this.performDownload(cb);
		}.bind(this));
	}

	performDownload (cb) {
		var self = this;
		var dest = path.join(__dirname, this.toDir, this.fullName);
		var opts ={
			ext: true,
			dest: dest
		}

		self.downloadMod(opts, function (err, res) {
			if (err) {
				self.downloadNpm(opts, function (err, res) {
					if (err) {
						return cb(self.fullName + ' not found.', undefined);
					}
					self.structure();
					return cb(undefined, 'Downloaded from npm');
				});
			} else {
				self.structure();
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

	structure () {
		var toPath = path.join(__dirname, this.toDir);
		var fromPath = path.join(toPath, this.fullName, 'package');
		toPath = path.join(toPath, this.name);
		fs.rename(fromPath, toPath);
		// fs.rmdirSync(path.join(__dirname, this.toDir, this.fullName));
	}
}

// var aPkg = new pkg('version-checker', '0.0.24');

// aPkg.download();