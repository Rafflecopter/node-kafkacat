var spawn = require('child_process').spawn

  , opts = require('./opts')


module.exports = function (options) {
  var args = opts.toArgs(options)
    , kc = spawn('kafkacat', ['-C'].concat(args))

  kc.on('error', kc.stdout.emit.bind(null, 'error'))

  kc.stderr.on('data', function (data) {
    kc.stdout.emit('error', new Error(data))
  })

  kc.on('close', function (code) {
    if (code !== 0) {
      kc.stdout.emit('error', new Error('Child process closed with error'))
    }
  })

  kc.stdout.end = function () {
    return kc.kill()
  }

  return kc.stdout
}
