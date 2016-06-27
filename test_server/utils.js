const crypto = require('crypto');

var utils = module.exports = {};

utils.hashName = function (name) {
	console.log(name)
	const sha1 = crypto.createHash('sha1');
	return sha1.update(name).digest('hex');
}

// console.log(utils.hashName('nghia@name'))