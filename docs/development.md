# Setting up Development Environment

## Install Node.js

Install Node.js by your favorite method, or use Node Version Manager by following directions at https://github.com/creationix/nvm

```bash
nvm install v4
```

## Fork and Download Repositories

To develop primeaicore-node:

```bash
cd ~
git clone git@github.com:<yourusername>/primeaicore-node.git
git clone git@github.com:<yourusername>/primeaicore-lib.git
```

To develop primeaicoin or to compile from source:

```bash
git clone git@github.com:<yourusername>/primeaicoin.git
git fetch origin <branchname>:<branchname>
git checkout <branchname>
```
**Note**: See primeaicoin documentation for building primeaicoin on your platform.


## Install Development Dependencies

For Ubuntu:
```bash
sudo apt-get install libzmq3-dev
sudo apt-get install build-essential
```
**Note**: Make sure that libzmq-dev is not installed, it should be removed when installing libzmq3-dev.


For Mac OS X:
```bash
brew install zeromq
```

## Install and Symlink

```bash
cd primeaicore-lib
npm install
cd ../primeaicore-node
npm install
```
**Note**: If you get a message about not being able to download primeaicoin distribution, you'll need to compile primeaid from source, and setup your configuration to use that version.


We now will setup symlinks in `primeaicore-node` *(repeat this for any other modules you're planning on developing)*:
```bash
cd node_modules
rm -rf primeaicore-lib
ln -s ~/primeaicore-lib
rm -rf primeaid-rpc
ln -s ~/primeaid-rpc
```

And if you're compiling or developing primeaicoin:
```bash
cd ../bin
ln -sf ~/primeaicoin/src/primeaid
```

## Run Tests

If you do not already have mocha installed:
```bash
npm install mocha -g
```

To run all test suites:
```bash
cd primeaicore-node
npm run regtest
npm run test
```

To run a specific unit test in watch mode:
```bash
mocha -w -R spec test/services/primeaid.unit.js
```

To run a specific regtest:
```bash
mocha -R spec regtest/primeaid.js
```

## Running a Development Node

To test running the node, you can setup a configuration that will specify development versions of all of the services:

```bash
cd ~
mkdir devnode
cd devnode
mkdir node_modules
touch primeaicore-node.json
touch package.json
```

Edit `primeaicore-node.json` with something similar to:
```json
{
  "network": "livenet",
  "port": 3001,
  "services": [
    "primeaid",
    "web",
    "insight-api",
    "insight-ui",
    "<additional_service>"
  ],
  "servicesConfig": {
    "primeaid": {
      "spawn": {
        "datadir": "/home/<youruser>/.primeaid",
        "exec": "/home/<youruser>/primeaicoin/src/primeaid"
      }
    }
  }
}
```

**Note**: To install services [insight-api](https://github.com/underdarkskies/insight-api) and [insight-ui](https://github.com/PrimeCryptoCoin/primeai-insight-block-explorer) you'll need to clone the repositories locally.

Setup symlinks for all of the services and dependencies:

```bash
cd node_modules
ln -s ~/primeaicore-lib
ln -s ~/primeaicore-node
ln -s ~/insight-api
ln -s ~/insight-ui
```

Make sure that the `<datadir>/primeai.conf` has the necessary settings, for example:
```
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://127.0.0.1:28332
zmqpubhashblock=tcp://127.0.0.1:28332
rpcallowip=127.0.0.1
rpcuser=primeaicoin
rpcpassword=local321
```

From within the `devnode` directory with the configuration file, start the node:
```bash
../primeaicore-node/bin/primeaicore-node start
```
