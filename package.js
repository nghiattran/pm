'use strict';

var path = require('path');
var download = require('./download');

// module.exports = class pkg {
class pkg {
	constructor (name, version) {
		this.name = name;
		this.version = version;
		this.fullName = this.name + '-' + this.version;
		this.file = this.fullName + '.tgz';
	}

	download (cb) {
		var dest = path.join(__dirname, this.fullName);
		var opts ={
			ext: true,
			dest: dest
		}
		console.log(typeof cb)
		this.downloadMod(opts, cb) 
			.on('error', function(err){

			})
		// try {
		// 	this.downloadMod(opts);
		// } catch(err) {
		// 	this.downloadNpm(opts);
		// }
	}

	downloadNpm (opts, cb) {
		console.log('here')
		var url = 'http://registry.npmjs.org/' + this.name + '/-/' + this.file;
		return download(url, opts, cb);
	}

	downloadMod (opts, cb) {
		console.log('there')
		var url = 'https://s3.amazonaws.com/nghiattran/' + this.file;
		return download(url, opts, cb);
	}
}

var aPkg = new pkg('npm', '1.0.0');

aPkg.download();