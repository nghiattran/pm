/// <reference path="node.d.ts" />
'use strict';
var endash = require('./components/endash');
var getVer = require('get-ver');
var bluebird = require('bluebird');
var GetPkg = bluebird.promisifyAll(require('./getPkg'));
var _ = require('lodash');
var path = require('path');
var pkgInfo = [];
var fs = require('fs');
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
        var tmpArray = constructPkgPath(direction, pkgs[i].name);
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
 * dir = ['pkg1', 'pkg2']
 * pkgName = 'pkg3'
 *
 * return: ['pkg1', 'dependencies', 'pkg2', 'dependencies', 'pkg3']
 */
function constructPkgPath(dir, pkgName) {
    var tmpPath = [];
    for (var x = 0; x < dir.length - 1; x++) {
        tmpPath.push(dir[x], 'dependencies');
    }
    tmpPath.push(pkgName);
    return tmpPath;
}
/**
 * [getConflictPkgs description]
 * Is used to filter out conflict pkgs
 *
 * return: an array of conflict pkgs array
 */
function getConflictPkgs(pkgs) {
    var tmp = {};
    var dups = _.reduce(pkgs, function (result, value, key) {
        (result[value.name] || (result[value.name] = [])).push(value);
        return result;
    }, {});
    var conflictPkgs = _.filter(dups, function (o) {
        return o.length > 1;
    });
    return conflictPkgs;
}
