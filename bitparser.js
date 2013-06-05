var util = require('util'),
    assert = require('assert');

module.exports = bitparser;
exports.BitParser = BitParser;

function BitParser(buffer) {
  assert(Buffer.isBuffer(buffer));

  this.index = ~~0;
  this.buffer = buffer;
  this.cache = ~~0;

  this._fillCache();
}

// last 5 bits of index must be === 0 when this is called
BitParser.prototype._fillCache = function() {
  var rem = this.buffer.length - (this.index >> 3);
  if (rem < 4) {
    if (rem === 1) {
      this.cache = this.buffer.readUInt8(this.index >> 3, false) << 24;
    } else if (rem > 0) {
      this.cache = this.buffer.readUInt16BE(this.index >> 3, false) << 16;
      if (rem === 3) {
        this.cache |= this.buffer.readUInt8((this.index >> 3) + 2, false) << 8;
      }
    }
  } else {
    this.cache = ~~this.buffer.readUInt32BE(this.index >> 3, false);
  }
}

// read 1 - 32 bits (no validation of n)
BitParser.prototype.readBits = function(n) {
  n = ~~n;

  var used = (this.index & 0x1f);
  var shift = (32 - n) - used;
  var res;

  this.index += n;

  if (shift < 0) {
    // not enough data in cache
    res = this.cache << -shift;
    this._fillCache();
    res |= this.cache >>> (32+shift);
  } else if (shift === 0) {
    res = this.cache;
    // prepare cache for next read
    this._fillCache();
  } else {
    res = this.cache >>> shift;
  }

  if (n === 32) {
    if (res >>> 31) // typecast signed integer to unsigned number
      res = 2 * (res >>> 1) + (res & 1);
  } else {
    var mask = ((1 << n) - 1) >> 0;
    res &= mask;
  }

  return res;
}

BitParser.prototype.read1Bit = function() {
  var used = (this.index & 0x1f);
  var shift = 31 - used;
  var res;

  this.index++;

  if (shift === 0) {
    res = this.cache;
    // prepare cache for next read
    this._fillCache();
  } else {
    res = this.cache >>> shift;
  }

  return res & 1;
}

BitParser.prototype.skipBits = function(n) {
  n = ~~n;

  var used = (this.index & 0x1f);
  var shift = (32 - n) - used;

  this.index += n;
  if (shift <= 0 || shift > 32)
    this._fillCache();
}

BitParser.prototype.reset = function() {
  this.index = ~~0;
  this._fillCache();
}

function bitparser(buffer) {
  return new BitParser(buffer);
}