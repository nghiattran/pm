'use strict'
var Pkg = require('./pkg')
var GetPkg = require('./getPkg')
var NpmPkg = require('./pkg.npm')

module.exports = class NovPkg extends Pkg {
  constructor (name, version) {
    super(name, version, false)

    // overwrite abstract methods
    super.getInfo = GetPkg.http
    super.install = this.install
    super.createNestedDependency = this.createNestedDependency

    // set class variables
    this.baseDir = 'modulars'
    this.baseUrl = 'registry.npmjs.org'
    this.identify = null 
  }

  /**
   * Install the package with its dependencies
   */
  install (cb) {
    cb = cb || function () {}

    this.getInfo(function (err, res) {
      if (err) {
        cb(err, undefined)
      } else {
        this.download(cb)
        this.installDependencies('dependencies')
      }
    }.bind(this))
  }

  /**
   * Download package from npm and extract it
   */
  download (cb) {
    var url = 'http://registry.npmjs.org/' + this.name + '/-/' + this.file
    return super.download(url, cb)
  }

  createNestedDependency (key, version) {
    var dependency;

    if (true) {
      dependency = new NovPkg(key, version)
    } else {
      dependency = new NpmPkg(key, version)
    }

    dependency.baseDir = path.join(this.baseDir, this.name, 'modulars')
    return dependency
  }
}