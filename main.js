var Pkg = require('./package');

var pkg = new Pkg('', '', true);

// pkg.readJson();
pkg.download(function (err, res) {
  console.log('err: ', err)
  console.log('res: ', res)
});
// pkg.dependencies[0].getInfo();
