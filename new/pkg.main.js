'use strict'
var Pkg = require('./pkg')
var GetPkg = require('./getPkg')
var NpmPkg = require('./pkg.npm')
var NovPkg = require('./pkg.npm')
var path = require('path')

module.exports = class MainPkg extends Pkg {
  constructor () {
    super(null, null, true)

    // overide abstract methods
    super.getInfo = GetPkg.packageJson
    super.install = this.install
    super.createNestedDependency = this.createNestedDependency

    // set class variables
    this.baseDir = 'modulars'
    this.identify = null
  }

  /**
   * The package with its dependencies
   */
  install (cb) {
    cb = cb || function () {}

    this.getInfo(function (err, res) {
      if (err) {
        cb(err, undefined)
      } else {
        cb(undefined, res)
        // this.download(cb)
        this.installDependencies('dependencies')
        this.installDependencies('devDependencies')
      }
    }.bind(this))
  }

  createNestedDependency (pkgName, version) {
    var dependency;

    if (this.isNov(pkgName)) {
      dependency = new NovPkg(pkgName, version)
    } else {
      dependency = new NpmPkg(pkgName, version)
    }

    dependency.baseDir = path.join(this.baseDir, this.name, 'modulars')
    return dependency
  }

  isNov (pkgName) {
    return false
  }
}
