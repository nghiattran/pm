var fs = require('fs');
var pkg = require('./package')

fs.readFile('package.json', {encoding: 'utf8'}, (err,data)=> {
	data = JSON.parse(data);
	var pkgs = [];
	for (var key in data.dependencies) {
		pkgs.push(new pkg(key,data.dependencies[key]))
	}

	// for (var i = 0; i < pkgs.length; i++) {
	// 	// console.log(pkgs[i]);
	// 	pkgs[i].download();
	// };

	pkgs[0].download(function he (err, res) {
		console.log(err);
	});
})