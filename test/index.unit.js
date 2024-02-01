'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export primeaicore-lib', function() {
    var primeaicore = require('../');
    should.exist(primeaicore.lib);
    should.exist(primeaicore.lib.Transaction);
    should.exist(primeaicore.lib.Block);
  });
});
