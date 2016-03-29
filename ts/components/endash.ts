/// <reference path="../node.d.ts" />

'use strict'

var fs = require('fs')

export function getList(cb: Function): void {

  fs.readFile('pack.json', 'utf8', function function_name(err, res) {
    if(!err) {
      try {
        return cb(undefined, JSON.parse(res)
      } catch (err) {
        return cb(err, undefined)
      }
    }
    return cb(err, undefined)
  })
}

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
export function set(object: Object, path: any[], value: any): Object {
  if (typeof object !== 'object') {
    return {
      err: 'Error! Expect an object.'
    }
  }

  if (path.length === 1) {
    object[path[0]] = value
    return {
      res: 'Updated'
    }
  } else if (path.length > 1) {
    var tmp = path.shift()
    object[tmp] = object[tmp] || {}

    if (typeof object[tmp] !== 'object') {
      return {
        err: 'Error! Expect ' + tmp + 'to be an object. Get ' + typeof object[tmp] + ' instead.'
      }
    }
    return set(object[tmp], path, value)
  }
}