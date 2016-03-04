var NpmPkg = require('./npmPkg')

var npmPkg = new NpmPkg('get-ver', '*')

function cb (err, res) {
  console.log('res: ' + res)
  console.log('err: ' + err)
}

npmPkg.install(cb)