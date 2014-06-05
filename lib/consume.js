var Readable = require('stream').Readable
  , exec = require('child_process').exec

  , opts = require('./opts')

module.exports = createConsumeStream

var createConsumeStream = function (options) {
  var rs = new Readable
    , offset = opts.getOffset(options)

  rs._read = function (count) {
    var cmd = [ 'kafkacat'
              , '-C'
              , opts.toArgs(options, offset, count)
              ].join(' ')
      , timeout = opts.getTimeout(options)
      , delim = opts.getDelimiter(options)

    var callback = function (err, stdout, stderr) {
      if (err !== null) {
        return rs.emit('error', err)
      }

      if (stderr !== null) {
        return rs.emit('error', new Error(stderr))
      }

      stdout.toString().split(delim).slice(0,-1).forEach(function (msg) {
        rs.push(msg)

        offset++
      })

      rs.push(null)
    }

    var childProcess = exec(cmd, {maxBuffer: opts.calcMaxBuffer(options)}, callback)

    if (timeout) { setTimeout(childProcess.kill.bind(childProcess), timeout) }
  }

  rs.getNextOffset = function () { return offset }

  return rs
}
