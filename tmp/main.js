/// <reference path="node.d.ts" />
'use strict';
var endash = require('./components/endash');
var tree = require('./tree');
var getDep = require('./getDependencies');
var _ = require('lodash');
var path = require('path');
var bluebird = require('bluebird');
var wget = bluebird.promisifyAll(require('my-wget'));
main();
function main() {
    // Get required pkgs
    // getDep.getAllDependencies(function (err, res) {
    //   const pkgs = res
    //   const conflictPkgs = tree.getConflictPkgs(pkgs)
    //   structurePkgs(pkgs, 'node_modules')
    //   var promises = []
    //   for (var i = 0; i < pkgs.length; i++) {
    //     promises.push(download(pkgs[i]))
    //   }
    //   bluebird.all(promises).then(function() {
    //     console.log("all the files were created");
    //   })
    // })
    // endash.getList(function (err, res) {
    //   if(!err) {
    //     const pkgs = res
    //     const conflictPkgs = tree.getConflictPkgs(pkgs)
    //     console.log(pkgs)
    //     structurePkgs(pkgs, 'node_modules')
    //     console.log(pkgs)
    //     var promises = []
    //     for (var i = 0; i < pkgs.length; i++) {
    //       promises.push(download(pkgs[i]))
    //     }
    //     bluebird.all(promises).then(function() {
    //       console.log("all the files were created");
    //     })
    //   } else {
    //     console.log('err', err)
    //   }
    // })
    displayTree();
}
function displayTree() {
    var treeSymbols = {
        first: '└─',
        second: '│ ',
        third: '┬ ',
        fourth: '├─'
    };
    endash.getList(function (err, res) {
        if (err) {
            console.log('err', err);
        }
        else {
            var pkgs = res;
            var list = tree.makeTree(pkgs);
            // console.log(list['npm-openweathermap'].dependencies)
            var tmp = list['npm-openweathermap'].dependencies;
            for (var i = 0; i < tmp.length; i++) {
                console.log(tmp[i]);
            }
        }
    });
}
function structurePkgs(pkgs, storeFolder) {
    console.log(pkgs.length);
    for (var i = 0; i < pkgs.length; i++) {
        if ('isConflict' in pkgs[i]) {
            var pathArray = pkgs[i].path.split(path.sep);
            pkgs[i].location = path.join(storeFolder, pathArray[pathArray.length - 2], storeFolder, pkgs[i].name);
        }
        else {
            pkgs[i].location = path.join(storeFolder, pkgs[i].name);
        }
    }
}
function download(pkg) {
    var url = 'http://registry.npmjs.org/' + pkg.name + '/-/' + pkg.name
        + '-' + pkg.version + '.tgz';
    var opts = {
        ext: true,
        dest: pkg.location,
        strip: 1
    };
    return wget(url, opts);
}
