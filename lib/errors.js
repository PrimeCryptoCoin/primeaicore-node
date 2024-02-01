'use strict';

var createError = require('errno').create;

var primeaicoreNodeError = createError('primeaicoreNodeError');

var RPCError = createError('RPCError', primeaicoreNodeError);

module.exports = {
  Error: primeaicoreNodeError,
  RPCError: RPCError
};
