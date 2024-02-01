'use strict';

var path = require('path');
var should = require('chai').should();
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('#defaultConfig', function() {
  var expectedExecPath = path.resolve(__dirname, '../../bin/primeaid');

  it('will return expected configuration', function() {
    var config = JSON.stringify({
      network: 'livenet',
      port: 3001,
      services: [
        'primeaid',
        'web'
      ],
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
		  sendTxLog: process.env.HOME + '/.primeaicore/pushtx.log',
          spawn: {
            datadir: process.env.HOME + '/.primeaicore/data',
            exec: expectedExecPath,
		    rpcqueue: 1000,
		    rpcport: 8766,
		    zmqpubrawtx: 'tcp://127.0.0.1:28332',
		    zmqpubhashblock: 'tcp://127.0.0.1:28332'
          }
        }
      }
    }, null, 2);
    var defaultConfig = proxyquire('../../lib/scaffold/default-config', {
      fs: {
        existsSync: sinon.stub().returns(false),
        writeFileSync: function(path, data) {
          path.should.equal(process.env.HOME + '/.primeaicore/primeaicore-node.json');
          data.should.equal(config);
        },
        readFileSync: function() {
          return config;
        }
      },
      mkdirp: {
        sync: sinon.stub()
      }
    });
    var home = process.env.HOME;
    var info = defaultConfig();
    info.path.should.equal(home + '/.primeaicore');
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3001);
    info.config.services.should.deep.equal(['primeaid', 'web']);
    var primeaid = info.config.servicesConfig.primeaid;
    should.exist(primeaid);
    primeaid.spawn.datadir.should.equal(home + '/.primeaicore/data');
    primeaid.spawn.exec.should.equal(expectedExecPath);
  });
  it('will include additional services', function() {
    var config = JSON.stringify({
      network: 'livenet',
      port: 3001,
      services: [
        'primeaid',
        'web',
        'insight-api',
        'insight-ui'
      ],
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
		  sendTxLog: process.env.HOME + '/.primeaicore/pushtx.log',
          spawn: {
            datadir: process.env.HOME + '/.primeaicore/data',
            exec: expectedExecPath,
		    rpcqueue: 1000,
		    rpcport: 8766,
		    zmqpubrawtx: 'tcp://127.0.0.1:28332',
		    zmqpubhashblock: 'tcp://127.0.0.1:28332'
          }
        }
      }
    }, null, 2);
    var defaultConfig = proxyquire('../../lib/scaffold/default-config', {
      fs: {
        existsSync: sinon.stub().returns(false),
        writeFileSync: function(path, data) {
          path.should.equal(process.env.HOME + '/.primeaicore/primeaicore-node.json');
          data.should.equal(config);
        },
        readFileSync: function() {
          return config;
        }
      },
      mkdirp: {
        sync: sinon.stub()
      }
    });
    var home = process.env.HOME;
    var info = defaultConfig({
      additionalServices: ['insight-api', 'insight-ui']
    });
    info.path.should.equal(home + '/.primeaicore');
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3001);
    info.config.services.should.deep.equal([
      'primeaid',
      'web',
      'insight-api',
      'insight-ui'
    ]);
    var primeaid = info.config.servicesConfig.primeaid;
    should.exist(primeaid);
    primeaid.spawn.datadir.should.equal(home + '/.primeaicore/data');
    primeaid.spawn.exec.should.equal(expectedExecPath);
  });
});
