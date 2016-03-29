/// <reference path="node.d.ts" />
'use strict';
var endash = require('./components/endash');
var tree = require('./tree');
var getDep = require('./getDependencies');
// console.log(tree.makeTree(endash.getList()))
getDep.getAllDependencies(function (err, res) {
    var pkgs = res;
    console.log(tree.makeTree(pkgs));
});
