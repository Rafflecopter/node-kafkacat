var _default = function (val, defaultVal) {
  return (val === undefined ? defaultVal : val)
}

var exports = module.exports

exports.toArgs = function (options, offset, count) {
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
    if (!!~['timeout', 'offset', 'count'].indexOf(opt)) { return }

    args.push(_default(map[opt], '-X'))

    if (map[opt] === undefined) {
      args.push([opt, options[opt]].join('='))
    } else {
      args.push(options[opt])
    }
  })

  if (offset !== undefined || exports.getOffset(options) !== undefined) {
    args.push(map.offset)
    args.push(_default(offset, exports.getOffset(options)))
  }

  if (count !== undefined || exports.getCount(options) !== undefined) {
    args.push(map.count)
    args.push(_default(count, exports.getCount(options)))
  }

  return args
}

exports.getOffset = function (options) {
  return _default(options.offset, 'end')
}

exports.getCount = function (options) {
  return options.count
}

exports.getTimeout = function (options) {
  return _default(options.timeout, 3000)
}

exports.getDelimiter = function (options) {
  return _default(options.delimiter, '\n')
}

exports.calcMaxBuffer = function (options) {
  var count = exports.getCount(options)
    , maxSize = _default(options['fetch.message.max.bytes'], 1024 * 1024)

  if (!count) { return 100 * 1024 * 1024 }

  return count * maxSize + 200 * 1024
}
