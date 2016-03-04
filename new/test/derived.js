'use strict'

var Base = require('./base')

console.log(Base)

module.exports = class Derived extends Base {
  constructor () {
    super()
    super.create();
    // var wow = super.create;
    // console.log(wow)
  }

  create () {
    console.log('create')
  }
}
