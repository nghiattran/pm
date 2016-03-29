/// <reference path="node.d.ts" />
'use strict';
var endash = require('./components/endash');
var tree = require('./tree');
var getDep = require('./getDependencies');
var _ = require('lodash');
var path = require('path');
main();
function main() {
    // Get required pkgs
    // getDep.getAllDependencies(function (err, res) {
    //   let pkgs = res
    //   console.log(res.length)
    // })
    endash.getList(function (err, res) {
        var pkgs = res;
        // console.log(pkgs.length)
        var pkgTree = tree.makeTree(pkgs);
        var conflictPkgs = tree.getConflictPkgs(pkgs);
        structurePkgs(pkgs);
        // console.log(pkgs.length)
    });
}
function structurePkgs(pkgs) {
    for (var i = 0; i < pkgs.length; i++) {
        if ('isConflict' in pkgs[i]) {
            var pathArray = pkgs[i].path.split(path.sep);
            pkgs[i].location = path.join(pathArray[pathArray.length - 2], 'node_modules', pkgs[i].name);
        }
        else {
            pkgs[i].location = pkgs[i].name;
        }
    }
}
