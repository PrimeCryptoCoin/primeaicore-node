'use strict';

var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

/**
 * Will return the path and default primeaicore-node configuration. It will search for the
 * configuration file in the "~/.primeaicore" directory, and if it doesn't exist, it will create one
 * based on default settings.
 * @param {Object} [options]
 * @param {Array} [options.additionalServices] - An optional array of services.
 */
function getDefaultConfig(options) {
  /* jshint maxstatements: 40 */
  if (!options) {
    options = {};
  }

  var defaultPath = path.resolve(process.env.HOME, './.primeaicore');
  var defaultConfigFile = path.resolve(defaultPath, './primeaicore-node.json');

  if (!fs.existsSync(defaultPath)) {
    mkdirp.sync(defaultPath);
  }

  var defaultServices = ['primeaid', 'web'];
  if (options.additionalServices) {
    defaultServices = defaultServices.concat(options.additionalServices);
  }

  if (!fs.existsSync(defaultConfigFile)) {
    var defaultConfig = {
      network: 'livenet',
      port: 3001,
      services: defaultServices,
	    messageLog: '',
      servicesConfig: {
        web: {
          disablePolling: true,
	        enableSocketRPC: false
		    },
		    'insight-ui': {
		      routePrefix: '',
          apiPrefix: 'api'
		    },
		    'insight-api': {
		      routePrefix: 'api',
		      coinTicker: 'https://api.coinmarketcap.com/v1/ticker/primeaicoin/?convert=USD',
		      coinShort: 'primeai',
		      db: {
			      host: '127.0.0.1',
			      port: '27017',
			      database: 'primeai-api-livenet',
			      user: 'primeaicore',
			      password: 'password123'
		      }
		    },
		    primeaid: {
		      sendTxLog: path.resolve(defaultPath, './pushtx.log'),
          spawn: {
            datadir: path.resolve(defaultPath, './data'),
            exec: path.resolve(__dirname, '../../bin/primeaid'),
			      rpcqueue: 1000,
			      rpcport: 8766,
			      zmqpubrawtx: 'tcp://127.0.0.1:28332',
			      zmqpubhashblock: 'tcp://127.0.0.1:28332'
          }
        }
      }
    };
    fs.writeFileSync(defaultConfigFile, JSON.stringify(defaultConfig, null, 2));
  }

  var defaultDataDir = path.resolve(defaultPath, './data');

  if (!fs.existsSync(defaultDataDir)) {
    mkdirp.sync(defaultDataDir);
  }

  var config = JSON.parse(fs.readFileSync(defaultConfigFile, 'utf-8'));

  return {
    path: defaultPath,
    config: config
  };

}

module.exports = getDefaultConfig;