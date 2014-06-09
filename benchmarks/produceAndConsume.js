// Using this script, I'm seeing ~4MB/s:
// [node-kafkacat (master)]$BROKERS=dev.raafl.com:9092 node benchmarks
// Produced and Consumed 104857632 bytes in 51106 ms. (4219 kB/s)


var kafkacat = require('../index')

  //, randWord = function (words) {
  //  var dwords = ['mouse', 'cup', 'box', 'headphones', 'keyboard', 'screen', 'paper',
  //                'desk', 'bag', 'pillow', 'chair', 'tree', 'car', 'window', 'dog',
  //                'van', 'brick', 'road', 'sun', 'clouds', 'music', 'pants']
  //    , pick = function (things) { 
  //      return things[Math.floor(Math.random()*things.length)]
  //    }
  //  return (words ? pick(words) : pick(dwords))
  //}

  //, randSentence = function (nWords) {
  //  var words = []

  //  for (var k=0; k < nWords; k++) {
  //    words.push(randWord())
  //  }

  //  return words.join(' ')
  //}

  , cOptions =  { brokers: process.env.BROKERS
                , topic: 'benchmark'
                , partition: 0
                , offset: 'end'
                }

  , pOptions =  { brokers: process.env.BROKERS
                , topic: 'benchmark'
                , partition: 0
                }

  , approxBytesToSend = 100 * 1024 * 1024
  , nWordsInSentence = 10

var consumeStream = kafkacat.createConsumeStream(cOptions)
  , produceStream = kafkacat.createProduceStream(pOptions)
  , bytesSent = 0
  , bytesReceived = 0

var startTime = Date.now()

consumeStream.on('error', function () {})

consumeStream.on('readable', function () {
  var chunk = consumeStream.read()

  if (!chunk) { return }

  while (chunk) {
    bytesReceived += chunk.length
    chunk = consumeStream.read()
  }

  if (bytesReceived === bytesSent && bytesReceived >= approxBytesToSend) {
    var timeElapsed = Date.now() - startTime
    console.log('Produced and Consumed ' + bytesReceived + ' bytes in ' + timeElapsed + ' ms. (' + Math.round(bytesReceived/timeElapsed) + ' kB/s)')

    consumeStream.end()
    produceStream.end()
  }
})


_write()

function _write() {
  var msg = "This is a message that we're going to send to kafka. We'll make it about 100 bytes. So, here's some filler.\n"
  produceStream.write(msg, function (err) {
    bytesSent += msg.length

    ;(bytesSent < approxBytesToSend) && setImmediate(_write)
  })
}
