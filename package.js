'use strict';

var path = require('path');
var download = require('my-wget');
var getVer = require('get-ver');
var fs = require('fs');
var http = require('http');
var semver = require('semver');

module.exports = class Pkg {
// class pkg {
	constructor (name, version, main) {
		// Whether this is the main package: to determine install devdependencies or not
		this.main = main || false;
		this.name = name;
		this.version = version;
		// name + available version
		this.fullName = null;
		// fullName + '.tgz'
		this.file = null;
		// base directory for installing dependencies
		this.baseDir = 'modulars';
		// path to the package, for main, it is the current directory
		// for dependencies and devDependencies, it it baseDir + fullName + package
		this.packagePath = null;
		this.dependencies = null;
		this.devDependencies = null;
		// path to entry file
		this.entry = null;
	}

	/**
	 * If the package is the current directory, download both types of dependencies 
	 */
	download (cb) {
		cb = cb || function (){};

		if (this.main) {
			this.readJson();
			this.downloadDependencies('devDependencies');
			this.downloadDependencies('dependencies');
		} else {
			this.getInfo(function (err, res) {
				if (err) {
					throw 'Unable to get data of ' + this.name;
				} else {
					this.performDownload(cb);
					this.downloadDependencies('dependencies');
				}
			}.bind(this));
		}
	}

	/**
	 * Down load from my site, if not available download from npm
	 */
	performDownload (cb) {
		this.packagePath = path.join(this.baseDir, this.fullName);
		var self = this;
		var opts ={
			ext: true,
			dest: this.packagePath
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

	/**
	 * What to do after downloading
	 */
	structure () {
		// var toPath = path.join(__dirname, this.toDir);
		// var fromPath = path.join(toPath, this.fullName, 'package');
		// toPath = path.join(toPath, this.name);
		// fs.rename(fromPath, toPath);
		// fs.rmdirSync(path.join(__dirname, this.toDir, this.fullName));
	}

	/**
	 * Read info from package.json, only used onced for current directory
	 */
	readJson (pathToJson) {
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

	/**
	 * Get package info from npm api
	 */
	getInfo (cb) {
		cb = cb || function () {};

		this.getPackageJson(function (err, res) {
			if (err) {
				throw err;
			} else {
				this.version = semver.maxSatisfying(Object.keys(res.versions), this.version);
				this.setPkg(res.versions[this.version]);			
			}
			cb(err, res);
		}.bind(this))
	}

	/**
	 * Set the package info
	 * @param {JOSN} data: get from package.json for from npm API
	 */
	setPkg (data) {
		this.name = data.name;
		this.version = data.version;
		this.fullName = this.name + '-' + this.version;
		this.file = this.fullName + '.tgz';

		this.dependencies = [];
		for (var key in data.dependencies) {
			this.dependencies.push(new Pkg(key, data.dependencies[key]));
		}

		this.devDependencies = [];
		for (var key in data.devDependencies) {
			this.devDependencies.push(new Pkg(key, data.devDependencies[key]));
		}
	}

	/**
	 * Get package info from npm api
	 */
	getPackageJson (cb) {
		var options = {
	    hostname: 'registry.npmjs.org',
	    path: ('/' + this.name)
	  };

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
            cb(undefined, data);
          } catch(err) {
          	cb(err, undefined);
          }
        })
    })
	}

	/**
	 * As name describes, key are two values 'dependencies' and 'devDependencies' 
	 */
	downloadDependencies (key) {
		if (this[key]) {
			for (var i = 0; i < this[key].length; i++) {
				this[key][i].download();
			};
		}
	}
}