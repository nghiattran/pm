/// <reference path="../node.d.ts" />
'use strict';
var fs = require('fs');
function getList(cb) {
    fs.readFile('pack.json', 'utf8', function function_name(err, res) {
        if (!err) {
            try {
                return cb(undefined, JSON.parse(res));
            }
            catch (err) {
                return cb(err, undefined);
            }
        }
        return cb(err, undefined);
    });
}
exports.getList = getList;
/**
 * [et decription]
 * Set value of an object with a path
 *
 * Example:
 * object: {}
 * path: ['first', 'second', 'third']
 * value: 'hi'
 *
 * return:
 * {
 *   first: {
 *     second: {
 *       third: 'hi'
 *     }
 *   }
 * }
 */
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
                err: 'Error! Expect ' + tmp + ' to be an object. Get ' + typeof object[tmp] + ' instead.'
            };
        }
        return set(object[tmp], path, value);
    }
}
exports.set = set;
function get(object, path) {
    if (typeof object !== 'object') {
        return {
            err: 'Error! Expect an object.'
        };
    }
    if (path.length === 1) {
        return object[path[0]];
    }
    else if (path.length > 1) {
        var tmp = path.shift();
        if (typeof object[tmp] !== 'object') {
            return {
                err: 'Error! Expect ' + tmp + ' to be an object. Get ' + typeof object[tmp] + ' instead.'
            };
        }
        return get(object[tmp], path);
    }
}
exports.get = get;
/**
 * [isSame description]
 * Is used to check wether 2 pkgs are the similar
 */
function isSame(left, right) {
    if (left.name === right.name) {
        if (left.version !== right.version) {
            return false;
        }
        return true;
    }
    return false;
}
exports.isSame = isSame;
/**
 * Map 2 array: 1 object array and index array
 * Example:
 * arr1: ['first', 'second', 'third']
 * arr2: [3,2]
 *
 * return: ['third', 'second']
 */
function copy(arr1, arr2) {
    var res = [];
    for (var i = 0; i < arr2.length; i++) {
        if (arr2[i] < 0 || arr2[i] > arr1.length) {
            throw 'Out of range.';
        }
        res.push(arr1[arr2[i]]);
    }
    return res;
}
exports.copy = copy;
