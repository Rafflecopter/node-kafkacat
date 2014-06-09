https://travis-ci.org/Rafflecopter/node-kafkacat.svg

Requirements
============
Quickly build using the bootsrap script: https://github.com/edenhill/kafkacat [1][2]

[1]: If you're using OSX, the librdkafka build fails when trying to build its examples. Some work arounds are suggested [here](https://github.com/edenhill/librdkafka/issues/49).  
[2]: Also, https://github.com/edenhill/kafkacat/issues/3

Usage
=====
`node-kafkacat` turns the kafkacat C library into [node streams](http://nodejs.org/api/stream.html). There is one difference between the consume stream and a typical readable stream, and that is the `.end` method which just kills the `kakfacat` process.

Refer to the tests for usage examples:
https://github.com/Rafflecopter/node-kafkacat/blob/master/tests/index.js

The mapping of option keys passed to the stream constructor to kafkacat command-line arguments is documented in code [here](https://github.com/Rafflecopter/node-kafkacat/blob/master/lib/opts.js#L8). Any extra settings as documented in kafkacat can be passed as well. `node-kafkacat` will take care of formatting them as `-X key=val` when calling kafkacat.
