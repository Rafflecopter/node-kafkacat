// tests/index.js
process.on('uncaughtException', function (err) {
  console.error(err.stack)
})
require('longjohn')

var kafkacat = require('../index')
  , randWord = function (words) {
    var dwords = ['mouse', 'cup', 'box', 'headphones', 'keyboard', 'screen', 'paper',
                  'desk', 'bag', 'pillow', 'chair', 'tree', 'car', 'window', 'dog',
                  'van', 'brick', 'road', 'sun', 'clouds', 'music', 'pants']
      , pick = function (things) { 
        return things[Math.floor(Math.random()*things.length)]
      }
    return (words ? pick(words) : pick(dwords))
  }

var tests = exports.tests = {}

tests.setUp = function (cb) {
  cb()
}

tests.tearDown = function (cb) {
  cb()
}

tests.txRxOneMsg = function (test) {
  var cOptions =  { brokers: process.env.BROKERS
                  , topic: 'foobar'
                  , partition: 0
                  , offset: 'end'
                  , unbuffered: true // tells kafkacat to use unbuffered I/O. Buffered can present a problem since kafkacat's stdout won't emit data unless a full chunk is ready.
                  }

    , pOptions =  { brokers: process.env.BROKERS
                  , topic: 'foobar'
                  , partition: 0
                  , unbuffered: true
                  }

  var consumeStream = kafkacat.createConsumeStream(cOptions)
    , produceStream = kafkacat.createProduceStream(pOptions)
    
    , msg = randWord() + '\n'

  consumeStream.on('readable', function () {
    var chunk = consumeStream.read()
      , data = new Buffer('')

    if (!chunk) { return }

    while (chunk) {
      data += chunk
      chunk = consumeStream.read()
    }

    test.equal(data.toString(), msg, 'Did not receive the same message that was transmitted\nSent: ' + msg + 'Received: ' + data.toString())

    produceStream.end()
    consumeStream.end()

    test.done()
  })

  var isBuffered = produceStream.write(msg, test.error)
}
