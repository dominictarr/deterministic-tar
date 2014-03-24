
var http = require('https')
var deterministic = require('./')
var zlib = require('zlib')
var crypto = require('crypto')

var hash = crypto.createHash('sha256')
var url = 
  'https://codeload.github.com/dominictarr/deterministic-tar/tar.gz/master'

http.get(url, function (stream) {
  stream
    .on('data', console.error)
    .pipe(zlib.createGunzip())
    .pipe(deterministic())
    .on('end', function () {
      console.log(hash.digest('hex'))
    })
    .pipe(hash)
})

