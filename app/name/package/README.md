# version-checker [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] 

> Check for outdated and lastest node packages.

## Installation

```sh
$ npm install --save version-checker
```

## Usage

```js
var vercheck = require('version-checker');

vercheck.check_local_packages().then(function(report){
	// "report" contains all:
	// 1. Package names
	// 2. Local version
	// 3. Available version specified in package.json
	// 4. Latest version on www.npmjs.com
}, function(error){
	// error handler
})

vercheck.check_global_packages().then(function(report){
	// "report" contains all:
	// 1. Package names
	// 2. Local version
	// 3. Latest version on www.npmjs.com
}, function(error){
	// error handler
})

vercheck.check_prefix_packages().then(function(report){
	// "report" contains all:
	// 1. Package names
	// 2. Local version
	// 3. Latest version on www.npmjs.com
}, function(error){
	// error handler
})

```

### Return format

```
├── fullfilled							// Packages that are found on www.npmjs.com
│   ├── pro								// Packages that are installed with '--save'
│   │   ├── package 1
│   │   ├── package 2
│   │   ...
│   ├── dev								// Packages that are installed with '--save-dev'
│   │   ├── package 1
│   │   ├── package 2
│   	...
├── error								// Packages that are not found on www.npmjs.com
│   ├── package 1
│   ├── package 2
	....
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/nghiattran/version-checker/issues/new).

## Author

**Nghia Tran**

+ [github/nghiattran](https://github.com/nghiattran)

## License

MIT © [NghiaTTran]()

<!-- [![Coverage percentage][coveralls-image]][coveralls-url] -->

[npm-image]: https://badge.fury.io/js/version-checker.svg
[npm-url]: https://npmjs.org/package/version-checker
[travis-image]: https://travis-ci.org/nghiattran/version-checker.svg?branch=master
[travis-url]: https://travis-ci.org/nghiattran/version-checker
[daviddm-image]: https://david-dm.org/nghiattran/version-checker.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/nghiattran/version-checker
[coveralls-image]: https://coveralls.io/repos/nghiattran/version-checker/badge.svg
[coveralls-url]: https://coveralls.io/r/nghiattran/version-checker