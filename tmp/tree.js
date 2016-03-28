/// <reference path="node.d.ts" />
var semver = require('semver');
var getVer = require('get-ver');
var bluebird = require('bluebird');
var GetPkg = bluebird.promisifyAll(require('./getPkg'));
var _ = require('lodash');
var path = require('path');
var pkgInfo = [];
var fs = require('fs');
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
        pkgs[i].layer = (pkgs[i].path.split(path.sep)).length;
    }
    var tree = {};
    // console.log(pkgs[90].path.split(path.sep))
    for (var i = 0; i < pkgs.length; i++) {
        var direction = _.cloneDeep(pkgs[i].path.split(path.sep));
        var len = direction.length;
        var index = 0;
        for (var x = 0; x < len - 2; x++) {
            direction.splice(x + 1, 0, 'dependencies');
        }
        console.log(direction);
    }
}
tree(getList());
function set(object, path, value) {
    if (typeof object !== 'object') {
        return {
            err: 'Error! Expect an object.'
        };
    }
    if (path.length === 1) {
        object[path[0]] = value;
        return {
            res: 'Updated'
        };
    }
    else if (path.length > 1) {
        var tmp = path.shift();
        object[tmp] = object[tmp] || {};
        if (typeof object[tmp] !== 'object') {
            return {
                err: 'Error! Expect ' + tmp + 'to be an object. Get ' + typeof object[tmp] + ' instead.'
            };
        }
        return set(object[tmp], path, value);
    }
}
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
