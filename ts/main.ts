/// <reference path="node.d.ts" />

'use strict'

const endash = require('./components/endash')
const tree = require('./tree')
const getDep =require('./getDependencies')
const _ = require('lodash')
const path = require('path')

main()

function main() {

  // Get required pkgs

  // getDep.getAllDependencies(function (err, res) {
  //   let pkgs = res
  //   console.log(res.length)
  // })

  endash.getList(function (err, res) {
    const pkgs = res
    // console.log(pkgs.length)
    const pkgTree = tree.makeTree(pkgs)
    const conflictPkgs = tree.getConflictPkgs(pkgs)

    structurePkgs(pkgs)
    // console.log(pkgs.length)

  })
}

function structurePkgs (pkgs: any[]) {
  for (var i = 0; i < pkgs.length; i++) {
    if('isConflict' in pkgs[i]) {
      var pathArray = pkgs[i].path.split(path.sep)
      pkgs[i].location = path.join(pathArray[pathArray.length - 2], 'node_modules', pkgs[i].name)
    } else {
      pkgs[i].location = pkgs[i].name
    }
  }
}
