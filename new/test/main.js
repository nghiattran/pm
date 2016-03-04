'use strict'

var Derived = require('./derived')
var Base = require('./base')
var hey = new Derived()

function getAllMethods(object) {
  return Object.getOwnPropertyNames(object).filter(function(property) {
      return typeof object[property] == 'function';
  });
}

// console.log(getAllMethods(Base));

// console.log(Object.getOwnPropertyNames(Base))
for (var key in Derived) {
  console.log(key)
};