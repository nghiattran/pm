/// <reference path="node.d.ts" />
"use strict";
var semver = require('semver');
var bluebird = require('bluebird');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var GetPkg = require('./getPkg');
GetPkg = bluebird.promisifyAll(GetPkg);
/**
 * [getAPkgDependencies description]
 * Get all dependencies of a set of pkgs
 */
function getAPkgDependencies(pkgs) {
    if (pkgs.length <= 0) {
        return;
    }
    var dependencies = [];
    return bluebird.map(pkgs, function (pkg) {
        return GetPkg.httpAsync(pkg.name)
            .then(function (res) {
            // Get version
            var version = semver.maxSatisfying(Object.keys(res.versions), pkg.version);
            var index = pkgs.indexOf(pkg);
            pkgs[index] = {
                path: path.join(pkg.path, pkg.name),
                name: pkg.name,
                version: version
            };
            // Get dependencies
            var tmp = res.versions[version].dependencies;
            if (tmp && tmp !== {}) {
                for (var tempPkg in tmp) {
                    dependencies.push({
                        name: tempPkg,
                        path: pkgs[index].path,
                        version: tmp[tempPkg]
                    });
                }
            }
        });
    })
        .then(function () {
        // return pkgs
        if (dependencies.length > 0) {
            return getAPkgDependencies(dependencies)
                .then(function (dependencies) {
                if (dependencies) {
                    pkgs = _.concat(pkgs, dependencies);
                }
                return pkgs;
            });
        }
    });
}
/**
 * [getAllPkgsDependencies description]
 * Get all dependencies specified in json file
 */
function getAllDependencies(cb) {
    GetPkg.packageJson(function (err, res) {
        var pkgs = [];
        var versions = [];
        for (var pkg in res.dependencies) {
            pkgs.push({
                name: pkg,
                path: '',
                version: res.dependencies[pkg]
            });
        }
        getAPkgDependencies(pkgs)
            .then(function (pkgs) {
            fs.writeFileSync('pack.json', JSON.stringify(pkgs, null, 2), 'utf8');
            cb(undefined, pkgs);
        })
            .catch(function (err) {
            cb(err, undefined);
        });
    });
}
exports.getAllDependencies = getAllDependencies;