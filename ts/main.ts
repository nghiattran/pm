/// <reference path="node.d.ts" />

'use strict'

const endash = require('./components/endash')
const tree = require('./tree')
const getDep =require('./getDependencies')

// console.log(tree.makeTree(endash.getList()))

getDep.getAllDependencies(function (err, res) {
  let pkgs = res
  console.log(tree.makeTree(pkgs))
})