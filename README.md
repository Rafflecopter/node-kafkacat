Requirements
============
Quickly build using the bootsrap script: https://github.com/edenhill/kafkacat

Note: If you're using OSX, the librdkafka build fails when trying to build its examples. Some work arounds are suggested [here](https://github.com/edenhill/librdkafka/issues/49).

Usage
=====
`node-kafkacat` turns the kafkacat C library into node streams

```
var kafkacat = require('kafkacat')
  , consumeStream = kafkacat.createConsumeStream(cOptions)
  , produceStream = kafkacat.createProduceStream(pOptions)


var chunk1 = consumeStream.read(3) // read 3 messages from kafka
  , chunk2 = consumeStream.read(3) // read 3 more messages from kafka

var isBuffered = produceStream.write('howdy\n', 'utf-8', function (err) {
  err && console.error(err)
})
```

The mapping of option keys passed to the stream constructor to kafkacat command-line arguments is documented in code [here](https://github.com/Rafflecopter/node-kafkacat/blob/master/lib/opts.js#L8). There are a few things to note: 
 - The consume stream holds the next offset as state, so subsequent calls to `.read` will return new messages. 
 - The argument passed to `.read` overrides `count` set in the options passed to the stream constructor
 - If `count` is not specified, `.read` will collect kafka messages for `timeout` milliseconds before returning. The default can be found in the `opts.js` source.
 - Any extra settings as documented in kafkacat can be passed as well. `node-kafkacat` will take care of formatting them as `-X key=val` when calling kafkacat.
