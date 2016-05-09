'use strict'

import * as endash from './components/endash'
import * as semver from 'semver'
import * as getVer from 'get-ver'
import * as bluebird from 'bluebird'
import * as _ from 'lodash'
import * as path from 'path'
import * as fs from 'fs'
import * as GetPkg from './getPkg'

GetPkg = bluebird.promisifyAll(GetPkg)

var pkgInfo = []

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
export function makeTree(pkgs: any[]) : Object {
  for (var i = 0; i < pkgs.length; i++) {
    pkgs[i].layer =(pkgs[i].path.split(path.sep)).length
  }

  var tree = {}

  for (var i = 0; i < pkgs.length; i++) {
    var direction = pkgs[i].path.split(path.sep)
    var tmpArray = constructPkgPath(pkgs[i].path)
    endash.set(tree, tmpArray, pkgs[i])
  }

  return tree
}

/**
 * [constructPkgPath description]
 * Construct the path to a pkg from dependency path
 *
 * Example:
 * dir = 'pkg1//pkg2//pkg3'
 *
 * return: ['pkg1', 'dependencies', 'pkg2', 'dependencies', 'pkg3']
 */
export function constructPkgPath(dir: string, subDir = 'dependencies') : any[] {
  var tempDir = dir.split(path.sep)
  var tmpPath = []
  var pkgName = tempDir.pop()
  for (var x = 0; x < tempDir.length;x++ ) {
    tmpPath.push(tempDir[x], subDir)
  }
  tmpPath.push(pkgName)
  return tmpPath
}

/**
 * [getConflictPkgs description]
 * Is used to filter out conflict pkgs
 *
 * return: an array of conflict pkgs array
 */
export function getConflictPkgs(pkgs: any[]) : any[] {
  var tmp = {}
  var dups = _.reduce(pkgs, function(result, value, key) {
    value.index = key;
    (result[value.name] || (result[value.name] = [])).push(value);
    return result;
  }, {})

  var conflictPkgs = _.filter(dups, function(o) {
    if(o.length > 1) {
      for (var i = 0; i < o.length; i++) {
        o[i].isConflict = true
      }
      return true
    }
 
    return false
  })

  return conflictPkgs
}