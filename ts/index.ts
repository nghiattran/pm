/// <reference path="node.d.ts" />

import * as fs from 'fs'


'use strict';

function add(x, y) {
  return x+y;
}

function packageJson (cb) {
  const pathToJson = 'test.json';

  try {
    let data = fs.readFileSync(pathToJson);
    try{
      data = JSON.parse(data);
      // this.setPkg(data);
      cb(undefined, data);
    } catch (err) {
      cb(err, undefined);
    }
  } catch (err) {
    cb(err, undefined);
  }
}

packageJson(function (err, res) {
	
})