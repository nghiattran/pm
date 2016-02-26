'use strict';

var fs = require("fs");
var path = require("path");
var exec = require('child_process').exec;
var q = require('q');
var utils = exports;
var find_up = require('find-up');

utils.get_directories_sync = function (srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
};

utils.get_files_sync = function (srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isFile();
    });
};

utils.read_json_file_sync = function (path_to_package_file) {
    return JSON.parse(fs.readFileSync(path_to_package_file));
};

utils.exec_async = function (cmd) {
    var deferred = q.defer();
    exec(cmd, function (error, stdout) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            stdout = stdout.replace(/(\r\n|\n|\r)/gm, "");
            deferred.resolve(stdout);
        }
    });
    return deferred.promise;
};

utils.get_base_path = function () {
    return path.dirname(find_up.sync('package.json', {}));
};