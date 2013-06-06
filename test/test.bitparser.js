var assert = require('assert');

var bitparser = require('../bitparser');

function test(fn) {
  var buf = new Buffer([0xDE, 0xAD, 0xBE, 0xEF, 0xF0, 0xAA, 0x55, 0x00, 0x0F]);
  var bp = bitparser(buf);
  fn(bp);
}

test(function(bp) {
  assert.equal(bp.readBits(3), 6);
  assert.equal(bp.readBits(3), 7);
  assert.equal(bp.readBits(1), 1);
  assert.equal(bp.readBits(7), 43);
});

test(function(bp) {
  bp.skipBits(3);
  assert.equal(bp.readBits(3), 7);
  bp.skipBits(1);
  assert.equal(bp.readBits(7), 43);

  bp.reset();
  assert.equal(bp.readBits(3), 6);
  bp.skipBits(3);
  bp.skipBits(-3);
  bp.skipBits(4);
  assert.equal(bp.readBits(7), 43);
});

test(function(bp) {
  // aligned getBuffer
  bp.skipBits(8);
  assert.deepEqual(bp.getBuffer(5), new Buffer([0xAD, 0xBE, 0xEF, 0xF0, 0xAA]));
  assert.equal(bp.readBits(4), 0x5);

  // unaligned getBuffer
  bp.reset();
  bp.skipBits(4);
  assert.deepEqual(bp.getBuffer(5), new Buffer([0xEA, 0xDB, 0xEE, 0xFF, 0x0A]));
  assert.equal(bp.readBits(4), 0xA);
});

test(function(bp) {
  assert.equal(bp.read1Bit(), 1);
  assert.equal(bp.readBits(31), 1588444911);
  bp.skipBits(-1);
  assert.equal(bp.read1Bit(), 1);
  assert.equal(bp.readBits(32), 0xf0aa5500);
});