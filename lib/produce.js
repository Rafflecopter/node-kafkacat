var spawn = require('child_process').spawn

  , opts = require('./opts')


module.exports = function (options) {
  var args = opts.toArgs(options)
    , kc = spawn('kafkacat', ['-P'].concat(args))

  kc.on('error', function (err) {
    kc.stdin.emit('error', err)
  })

  kc.stderr.on('data', function (data) {
    kc.stdin.emit('error', new Error(data))
  })

  return kc.stdin
}
