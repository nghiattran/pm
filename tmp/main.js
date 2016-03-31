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
    //   // const reducedList = _.uniqWith(pkgs, isSame)
    //   // const conflictPkgs = tree.getConflictPkgs(pkgs)
    //   // structurePkgs(pkgs, 'node_modules')
    //   // console.log(pkgs.length)
    //   // var promises = []
    //   // for (var i = 0; i < pkgs.length; i++) {
    //   //   promises.push(download(pkgs[i]))
    //   // }
    //   // bluebird.all(promises).then(function() {
    //   //   console.log("all the files were created");
    //   // })
    // })
    // endash.getList(function (err, res) {
    //   if(!err) {
    //     const reducedList = _.uniqWith(pkgs, isSame)
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
    displayTree('request', '2.69.0');
    // displayTree()
}
function displayTree(pkgName, version) {
    if (pkgName === void 0) { pkgName = ''; }
    if (version === void 0) { version = ''; }
    endash.getList(function (err, res) {
        if (err) {
            // TODO chang file's name
            throw "Can't find json file";
        }
        else {
            var pkgs = res;
            var list = tree.makeTree(pkgs);
            if (pkgName) {
                var foundPkgs = findPkgName(pkgs, pkgName, version);
                for (var i = 0; i < foundPkgs.length; i++) {
                    var tmp = {};
                    tmp[foundPkgs[i].name] = foundPkgs[i];
                    treeLine(tmp);
                }
            }
            else {
                treeLine(list);
            }
        }
    });
}
/**
 * [findPkgName description]
 * Look for a particular pkg in the array
 */
function findPkgName(pkgs, pkgName, version) {
    if (version === void 0) { version = ''; }
    var samePkg = [];
    var res = [];
    for (var i = 0; i < pkgs.length; i++) {
        if (pkgs[i].name === pkgName) {
            var pkgInfo = {
                name: pkgs[i].name,
                version: pkgs[i].version
            };
            if (_.findIndex(samePkg, pkgInfo) === -1) {
                samePkg.push(pkgInfo);
                res.push(i);
            }
        }
    }
    if (version) {
        var index = [_.findIndex(samePkg, {
                name: pkgName,
                version: version
            })];
        return endash.copy(pkgs, [res[index]]);
    }
    return endash.copy(pkgs, res);
}
var treeSymbols = {
    first: '└─',
    second: '│ ',
    third: '┬ ',
    fourth: '├─',
    fifth: '─ '
};
function treeLine(tree, line) {
    if (line === void 0) { line = ''; }
    var tempLine = line;
    var space = '';
    var treeLength = Object.keys(tree).length;
    var i = 0;
    for (var pkg in tree) {
        var pkgInfo = tree[pkg].name + '@' + tree[pkg].version;
        // If the pkg is the only one or is the last one
        // Display with '└─name'
        // else
        // Display with '├─'
        if (treeLength === 1 || i === treeLength - 1) {
            tempLine += treeSymbols.first;
            space = '  ';
        }
        else {
            tempLine += treeSymbols.fourth;
            space = treeSymbols.second;
        }
        // If the pkg does not have dependencies
        // Display with '└─name'
        // else
        // Go to the next layer with prefix 'space'
        if (_.isEmpty(tree[pkg].dependencies)) {
            console.log(tempLine + treeSymbols.fifth + pkgInfo);
        }
        else {
            console.log(tempLine + treeSymbols.third + pkgInfo);
            treeLine(tree[pkg].dependencies, line + space);
        }
        tempLine = line;
        i++;
    }
}
/**
 * Structure npm pkgs
 * Conflict pkgs are put in to node_modules in their dependent pkg
 * Non coflict pkgs are put int root node_modules
 */
function structurePkgs(pkgs, storeFolder) {
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
