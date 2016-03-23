'use strict';

var http = require('http')
var fs = require('fs')
var semver = require('semver')
var path = require('path')
var wget = require('my-wget')

module.exports = class Pkg {
  constructor (name, version, main) {
    // Whether this is the main package: to determine install devdependencies or not
    this.main = main || false;
    this.name = name;
    this.version = version;
    // name + available version
    this.fullName = null;
    // fullName + '.tgz'
    this.file = null;
    // base directory for installing dependencies
    this.baseDir = null;
    // path to the package, for main, it is the current directory
    // for dependencies and devDependencies, it it baseDir + fullName + package
    this.packagePath = null;
    this.dependencies = [];
    this.devDependencies = [];
    this.baseUrl = null;
  }

  install () {
    throw 'Abstract method, need to be implemented.'
  }

  createNestedDependency (name, version) {
    throw 'Abstract method, need to be implemented.'
  }

  getInfo (cb) {
    throw 'Abstract method, need to be implemented.'
  }

  /**
   * Set the package info
   * @param {JOSN} data: get from package.json for from npm API
   */
  setPkg (data) {
    this.name = data.name;
    this.version = data.version;
    this.fullName = this.name + '-' + this.version;
    this.file = this.fullName + '.tgz';

    for (var key in data.dependencies) {
      this.dependencies.push(this.createNestedDependency(key, data.dependencies[key]));
    }

    if (this.main) {
      for (var key in data.devDependencies) {
        this.devDependencies.push(this.createNestedDependency(key, data.devDependencies[key]));
      }
    }
  }

  /**
   * Download package from npm and extract it
   */
  download (url, cb) {
    var opts ={
      ext: true,
      dest: path.join(this.baseDir, this.name),
      strip: 1
    }
    
    return wget(url, opts, cb)
  }

  /**
   * As name describes, key are two values 'dependencies' and 'devDependencies' 
   */
  installDependencies (key) {
    if (this[key]) {
      for (var i = 0; i < this[key].length; i++) {
        this[key][i].install();
      };
    }
  }
}
