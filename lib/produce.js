var Writable = require('stream').Writable
  , spawn = require('child_process').spawn

  , opts = require('./opts')

module.exports = createProduceStream

var createProduceStream = function (options) {
  var args = opts.toArgs(options).split(' ')
    , kc = spawn('kafkacat', ['-P'].concat(args))

  kc.on('error', function (err) {
    kc.stdin.emit('error', err)
  })

  kc.stderr.on('data', function (data) {
    kc.stdin.emit('error', new Error(data))
  })

  kc.on('close', function (code) {
    if (code !== 0) {
      kc.stdin.emit('error', new Error('Child process closed with error'))
    }
  })

  return kc.stdin.bind(kc)
}
