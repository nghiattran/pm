var download = require('my-wget')

download('http://registry.npmjs.org/version-checker/-/version-checker-0.1.5.tgz', {ext: true, dest: 'app/name'})