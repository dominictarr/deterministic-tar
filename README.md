# deterministic-tar

generate/transform a tarball that hashes consistently.

strips out timestamps, user ids, and optional trailing null blocks.

## Example

``` js
var http = require('https')
var deterministic = require('./')
var zlib = require('zlib')
var crypto = require('crypto')

var hash = crypto.createHash('sha256')

var url = 
  'https://codeload.github.com/dominictarr/deterministic-tar/tar.gz/master'

http.get(url, function (stream) {
  stream
    .pipe(zlib.createGunzip())

    // force the tarball to be deterministic!
    .pipe(deterministic())

    .on('data', function (data) {
      hash.update(data)
    })
    .on('end', function () {
      console.log(hash.digest('hex'))
    })
})
```

## License

MIT
