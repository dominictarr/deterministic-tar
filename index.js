var tar = require('tar-stream')
var duplexer = require('duplexer')

var UNIXZERO = new Date(new Date().getTimezoneOffset() * -1)

var deterministic = module.exports = function (map) {

  var pack = tar.pack()

  var extract = 
    tar.extract()
      .on('entry', function (header, stream, cb) {
        if(header.type !== 'file') return cb()

        header.mtime = header.atime = header.ctime = UNIXZERO
        header.uid = header.gid = 0

        delete header.uname
        delete header.gname
      
        header.mode = header.type === 'directory' ? 0755 : 0644

        if(map) header = map(header) || header

        stream.pipe(pack.entry(header, cb))
      })
      .on('finish', function () {
        pack.finalize()
      })

  return duplexer(extract, pack)
}

if(!module.parent)
  process.stdin
    .pipe(deterministic())
    .pipe(process.stdout)
