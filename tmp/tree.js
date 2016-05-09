'use strict';
var endash = require('./components/endash');
var bluebird = require('bluebird');
var _ = require('lodash');
var path = require('path');
var GetPkg = require('./getPkg');
GetPkg = bluebird.promisifyAll(GetPkg);
var pkgInfo = [];
/**
 * [makeTree description]
 * Construct dependency tree from pkg list
 *
 * Example:
 * pkgs = [pkg1, pkg2, pkg3]
 * return: (assume pkg2 depend on pkg1 and pkg3 is independent)
 * {
 *   pkg1: {
 *     dependencies: {
 *       pkg2
 *     }
 *   },
 *   pkg3
 * }
 */
function makeTree(pkgs) {
    for (var i = 0; i < pkgs.length; i++) {
        pkgs[i].layer = (pkgs[i].path.split(path.sep)).length;
    }
    var tree = {};
    for (var i = 0; i < pkgs.length; i++) {
        var direction = pkgs[i].path.split(path.sep);
        var tmpArray = constructPkgPath(pkgs[i].path);
        endash.set(tree, tmpArray, pkgs[i]);
    }
    return tree;
}
exports.makeTree = makeTree;
/**
 * [constructPkgPath description]
 * Construct the path to a pkg from dependency path
 *
 * Example:
 * dir = 'pkg1//pkg2//pkg3'
 *
 * return: ['pkg1', 'dependencies', 'pkg2', 'dependencies', 'pkg3']
 */
function constructPkgPath(dir, subDir) {
    if (subDir === void 0) { subDir = 'dependencies'; }
    var tempDir = dir.split(path.sep);
    var tmpPath = [];
    var pkgName = tempDir.pop();
    for (var x = 0; x < tempDir.length; x++) {
        tmpPath.push(tempDir[x], subDir);
    }
    tmpPath.push(pkgName);
    return tmpPath;
}
exports.constructPkgPath = constructPkgPath;
/**
 * [getConflictPkgs description]
 * Is used to filter out conflict pkgs
 *
 * return: an array of conflict pkgs array
 */
function getConflictPkgs(pkgs) {
    var tmp = {};
    var dups = _.reduce(pkgs, function (result, value, key) {
        value.index = key;
        (result[value.name] || (result[value.name] = [])).push(value);
        return result;
    }, {});
    var conflictPkgs = _.filter(dups, function (o) {
        if (o.length > 1) {
            for (var i = 0; i < o.length; i++) {
                o[i].isConflict = true;
            }
            return true;
        }
        return false;
    });
    return conflictPkgs;
}
exports.getConflictPkgs = getConflictPkgs;
