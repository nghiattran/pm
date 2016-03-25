/// <reference path="node.d.ts" />
var semver = require('semver');
var getVer = require('get-ver');
var bluebird = require('bluebird');
var GetPkg = bluebird.promisifyAll(require('./getPkg'));
var _ = require('lodash');
var path = require('path');
var pkgInfo = [];
var fs = require('fs');

var deli = '/'

// GetPkg.packageJson(function(err, res) {
//   var pkgs = []
//   var versions = []
//   for (var pkg in res.dependencies) {
//     pkgs.push({ 
//       name: pkg,
//       path: '',
//       version: res.dependencies[pkg]
//     })
//   }
//   get(pkgs)
//     .then(function(pkgs) {
//       console.log(pkgs)
//       console.log(pkgs.length)
//       var tempTest = _.uniqBy(pkgs, 'name')
//       var temp = _.uniqWith(pkgs, isSame)
//       fs.writeFileSync('pack.json', JSON.stringify(pkgs, null, 2),'utf8')
//       console.log(temp.length)
//       console.log(tempTest.length)
//     })
// })
function getList() {
    try {
        return JSON.parse(fs.readFileSync('pack.json', 'utf8'));
    }
    catch (err) {
        return { err: err };
    }
}
function tree(pkgs) {
    for (var i = 0; i < pkgs.length; i++) {
        pkgs[i].layer = (pkgs[i].path.split(deli)).length;
    }
    // console.log(pkgs)
    pkgs = construct(pkgs)
    var tree = buildTree(pkgs)

    // var uniquePkgs = _.uniqWith(pkgs, isSame)
    // var conflictPkgs = getConflictPkgs(uniquePkgs)
    // console.log(uniquePkgs.length)
    // console.log(conflictPkgs.length)
}

function construct (pkgs) {
    var result = {}
    for (var i = 0; i < pkgs.length; i++) {
        result[pkgs[i].name] = pkgs[i]
    }
    return result
}
    
function buildTree (pkgs) {

    var tmp = {}
    var tmp1 = {}

    for (var pkg in pkgs) {

    }

    // var tree = {};
    // var layer = 1;
    // var layerPkgs = [];
    // var dependent = ''
    // var tmpDependencies = {}
    // for (var i = pkgs.length - 1; i >= 0; i--) {
    //     if (layer !== pkgs[i].layer - 1) {
    //         layer = pkgs[i].layer - 1 
    //         layerPkgs[layer] ={}
    //         tmpDependencies = {}

    //         for (var pkg in tmpDependencies) {

    //         }
    //     }

    //     var tmpDependent = layerPkgs[i]['tar'].path.split(deli)[layerPkgs[i]['tar'].layer - 2]
    //     if (tmpDependent !== dependent) {
    //         dependent = tmpDependent
    //         tmpDependencies[tmpDependent] = []
    //     }

    //     tmpDependent[tmpDependent].push(pkg)


    //     // layerPkgs[layer][path.basename(pkgs[i].path)] = pkgs[i];
    // }
}

function makeChange (obj, path, value) {
    if (typeof obj === 'object') {
        if (path < 1) {
            obj[path] = value
            return {msg: 'Updated'}
        } else {
            return {error: 'Could not reach destination'}
        }
    }

    return {error: 'Could not reach destination'}
}

tree(getList());
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
function isSame(left, right) {
    if (left.name === right.name) {
        if (left.version !== right.version) {
            return false;
        }
        return true;
    }
    return false;
}
function get(pkgs) {
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
                for (var package in tmp) {
                    dependencies.push({
                        name: package,
                        path: pkgs[index].path,
                        version: tmp[package]
                    });
                }
            }
        });
    })
        .then(function () {
        // return pkgs
        if (dependencies.length > 0) {
            return get(dependencies)
                .then(function (dependencies) {
                if (dependencies) {
                    pkgs = _.concat(pkgs, dependencies);
                }
                return pkgs;
            });
        }
    });
}
