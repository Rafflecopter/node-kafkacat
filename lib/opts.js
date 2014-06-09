var _default = function (val, defaultVal) {
  return (val === undefined ? defaultVal : val)
}

var exports = module.exports

exports.toArgs = function (options) {
  var map = { topic: '-t'
            , partition: '-p'
            , brokers: '-b'
            , delimiter: '-D'
            , count: '-c'
            , compression: '-z'
            , offset: '-o'
            }

  var args = []

  Object.keys(options).forEach(function (opt) {
    args.push(_default(map[opt], '-X'))

    if (map[opt] === undefined) {
      args.push([opt, options[opt]].join('='))
    } else {
      args.push(options[opt])
    }
  })

  return args
}
