var zlib = require('zlib');
const gzip = zlib.createGzip();
const fs = require('fs');

var file = 'version-checker-0.0.2'

const inp = fs.createReadStream('./test');
const out = fs.createWriteStream(file + '.tgz');

inp.pipe(gzip).pipe(out);