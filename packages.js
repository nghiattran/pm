var fs = require('fs');
var Pkg = require('./package')

fs.readFile('package.json', {encoding: 'utf8'}, (err,data)=> {
	data = JSON.parse(data);
	var pkgs = [];
	for (var key in data.dependencies) {
		pkgs.push(new Pkg(key, data.dependencies[key]));
		// break;
	}
	// console.log(pkgs[1])
	for (var i = 0; i < pkgs.length; i++) {
		pkgs[i].download('modulars', function (err, res) {
			if (err) {
				console.log(err);
			} else {
				console.log(res);
			}
		});
	};

	// pkgs[0].download('modulars', function (err, res) {
	// 	console.log(err);
	// });
})