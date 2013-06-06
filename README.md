# bitparser for node

This module enables sequential bitwise parsing of binary Buffers, using a simple `.readBits(n)` interface.

## Usage
    var bitparser = require('bitparser');

    var buffer = new Buffer([0xDE, 0xAD, 0xBE, 0xEF]);
    var bp = bitparser(buffer);

    // read first 5 bits
    var first = bp.readBits(5);

    // read next 12 bits
    var second = bp.readBits(12);

    // skip the next 14 bits
    bp.skipBits(14);

    // read final bit
    var final = bp.read1Bit();

    console.log('bits:', [first, second, final]);

Output:

    bits: [ 27, 3419, 1 ]

## Installation
    npm install bitparser

## Methods

### bitparser(buffer)
Create a `BitParser` for the `buffer` of type `Buffer`, starting at index 0.

*Note:* Due to internal caching, the result will be undefined if the buffer is modified during parsing.

### .readBits(n)
Read next 1 to 32 bits from the buffer, as specified by `n`, advancing the index.

*Note:* `n` is not checked for validity, and any read past the end of the buffer returns undefined bits.

### .read1Bit()
Read 1 bit from the buffer, advancing the index. For optimal performance, use this instead of `.readBits(1)`.

### .skipBits(n)
Skip next `n` bits from the buffer by advancing the index. `n` can be any amount of bits, including negative values which will rewind the parser.

### .getBuffer(len)
Read `len` bytes, returning a `Buffer` object with the contents.

*Note:* The returned buffer is only valid as long as the original buffer is not modified.

### .reset()
Reset the parser, starting at index 0.

# License
(BSD 2-Clause License)

Copyright (c) 2013, Gil Pedersen &lt;gpdev@gpost.dk&gt;  
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met: 

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer. 
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
