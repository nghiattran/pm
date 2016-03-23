/// <reference path="node.d.ts" />
"use strict";
var fs = require('fs');
'use strict';
function add(x, y) {
    return x + y;
}
function packageJson(cb) {
    var pathToJson = 'test.json';
    try {
        var data = fs.readFileSync(pathToJson);
        try {
            data = JSON.parse(data);
            // this.setPkg(data);
            cb(undefined, data);
        }
        catch (err) {
            cb(err, undefined);
        }
    }
    catch (err) {
        cb(err, undefined);
    }
}
packageJson(function (err, res) {
});
