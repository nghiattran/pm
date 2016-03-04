var getVer = require('./modulars/get-ver-1.0.0/package/');

getVer('semver')
  .then(function (res) {
    // do somgthing
    console.log(res)
  })
  .catch(function (res) {
    // catch error
    console.log(res)
  })