'use strict'
var Pkg = require('./basePkg')
var fs = require('fs')
var semver = require('semver')
var path = require('path')
var GetPkg = require('./getPkg')

module.exports = class NpmPkg extends Pkg {
  constructor (name, version) {
    super(name, version, false)

    // overide abstract methods
    super.getInfo = GetPkg.http
    super.install = this.install
    super.createNestedDependency = this.createNestedDependency

    // set class variables
    this.baseDir = 'node_modules'
    this.baseUrl = 'registry.npmjs.org'
  }

  /**
   * The package with its dependencies
   */
  install (cb) {
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
    var dependency = new NpmPkg(key, version)
    dependency.baseDir = path.join(this.baseDir, this.name, this.baseDir)
    return dependency
  }
}