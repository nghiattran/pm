// var NpmPkg = require('./pkg.npm')

// var npmPkg = new NpmPkg('version-checker', '*')

function cb (err, res) {
  console.log('res: ' + res)
  for (var keys in res) {
  	console.log(keys + ": " + res[keys])
  };
  console.log('err: ' + err)
}

// npmPkg.install(cb)

var MainPkg = require('./pkg.main')

var main = new MainPkg();

main.install(cb)