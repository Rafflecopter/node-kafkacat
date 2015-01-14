var spawn = require('child_process').spawn

  , opts = require('./opts')


module.exports = function (options) {
  var args = opts.toArgs(options)
    , kc = spawn('kafkacat', ['-C'].concat(args))

  kc.on('error', kc.stdout.emit.bind(kc.stdout, 'error'))

  kc.stderr.on('data', function (data) {
    kc.stdout.emit('error', new Error(data))
  })

  kc.stdout.end = function () {
    return kc.kill()
  }

  return kc.stdout
}
