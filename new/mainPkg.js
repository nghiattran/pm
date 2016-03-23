'use strict'
var Pkg = require('./basePkg')
var fs = require('fs')
var semver = require('semver')
var path = require('path')
var GetPkg = require('./getPkg')
var NpmPkg = require('./npmPkg')
var NovPkg = require('./novPkg')

module.exports = class MainPkg extends Pkg {
  constructor (name, version) {
    super(name, version, false)

    // overwrite abstract methods
    super.getInfo = GetPkg.packageJson
    super.install = this.install
    super.createNestedDependency = this.createNestedDependency

    // set class variables
    this.baseDir = 'modulars'
    this.baseUrl = 'registry.npmjs.org'
    this.identify = null 

    this.download = NovPkg.download
    this.createNestedDependency = NovPkg.createNestedDependency
  }

  /**
   * Install the package with its dependencies
   */
  install (cb) {
    this.getInfo(function (err, res) {
      if (err) {
        cb(err, undefined)
      } else {
        this.download(cb)
        this.installDependencies('dependencies')
        this.installDependencies('devDependencies')
      }
    }.bind(this))
  }
}