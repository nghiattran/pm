'use strict';

var packageJson = require('package-json');
var path = require('path');
var q = require('q');
var utils = require('./utils');
var global_modules = require('global-modules');

var vercheck = exports;

function get_global_package_path() {
    return path.resolve(global_modules, '../../');
}

function get_prefix_package_path() {
    var cmd = 'npm config get prefix';
    return utils.exec_async(cmd);
}

function read_pakageJson(base_path) {
    var path_to_package_file = path.join(base_path, 'package.json');
    try {
        var package_info = utils.read_json_file_sync(path_to_package_file);
        return {
            pro: package_info.dependencies,
            dev: package_info.devDependencies
        };
    } catch (err) {
        if (err.code === 'ENOENT') {
            return -1;
        } else {
            throw e;
        }
    }
}

function get_package_version(package_name, base_path) {
    var package_path = path.join(base_path, package_name, 'package.json');
    try {
        var package_info = utils.read_json_file_sync(package_path);
        return package_info.version;
    } catch (err) {
        if (err.code === 'ENOENT') {
            return -1;
        } else {
            throw e;
        }
    }
}

function get_local_package_info(package_name, version, base_path) {
    return packageJson(package_name, version).then(function (available) {
        return packageJson(package_name, 'latest').then(function (latest) {
            return {
                name: package_name,
                required: version,
                available: available.version,
                latest: latest.version,
                installed: get_package_version(package_name, path.join(base_path, 'node_modules'))
            };
        });
    });
}

function get_global_package_info(package_name, global_path) {
    return packageJson(package_name, 'latest').then(function (latest) {
        return {
            name: package_name,
            latest: latest.version,
            installed: get_package_version(package_name, global_path)
        };
    });
}

function format_report(data_in_promises) {
    var fulfilled = [];
    var error = [];
    for (var i = 0; i < data_in_promises.length; i++) {
        if (data_in_promises[i].state === 'fulfilled') {
            fulfilled.push(data_in_promises[i].value);
        } else {
            error.push(data_in_promises[i].value);
        }
    }
    return { fulfilled: fulfilled, error: error };
}

function generate_global_report(packages, global_path) {
    var promises = [];
    for (var i = 0; i < packages.length; i++) {
        promises.push(get_global_package_info(packages[i], global_path));
    }

    return q.allSettled(promises).then(format_report);
}

function generate_local_report(packages, base_path) {
    var promises = [];
    for (var key in packages) {
        promises.push(get_local_package_info(key, packages[key], base_path));
    }
    return q.allSettled(promises).then(format_report);
}

function create_error_promise(error) {
    var deferred = q.defer();
    deferred.reject(new Error(error));
    return deferred.promise;
}

vercheck.check_prefix_packages = function () {
    return get_prefix_package_path().then(function (global_path) {
        global_path = path.resolve(global_path, './lib/node_modules');
        var packages = utils.get_directories_sync(global_path);
        return generate_global_report(packages, global_path).then(function (report) {
            return {
                pro: report
            };
        });
    });
};

vercheck.check_global_packages = function () {
    var global_path = get_global_package_path();
    global_path = path.resolve(global_path, './lib/node_modules');
    var packages = utils.get_directories_sync(global_path);
    return generate_global_report(packages, global_path).then(function (report) {
        return {
            pro: report
        };
    });
};

vercheck.check_local_packages = function () {
    var base_path = utils.get_base_path();
    var packages = read_pakageJson(base_path);
    if (packages === -1) {
        return create_error_promise('Cannot find package.json file!');
    }

    return generate_local_report(packages.pro, base_path).then(function (pro_report) {
        return generate_local_report(packages.dev, base_path).then(function (dev_report) {
            return {
                pro: pro_report,
                dev: dev_report
            };
        });
    });
};