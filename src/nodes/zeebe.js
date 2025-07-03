const logger = require('../util/logger');

module.exports = function (RED) {
    const ZB = require('zeebe-node');

    function Zeebe(config) {
        RED.nodes.createNode(this, config);

        const node = this;

        // Validate configuration
        if (!config.contactPoint) {
            node.error('Missing contact point configuration');
            return;
        }

        const options = {
            useTLS: Boolean(config.useTls),
            eagerConnection: Boolean(config.eagerConnection),
            oAuth: {
                url: config.oAuthUrl,
                audience: config.contactPoint.split(':')[0],
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                cacheOnDisk: true,
            },
            onReady: () => {
                node.log(`Connected to ${config.contactPoint}`);
                node.emit('ready');
            },
            onConnectionError: (error) => {
                node.log('Connection Error: ' + (error && error.message ? error.message : 'Unknown error'));
                node.emit('connectionError');
            },
            loglevel: 'DEBUG',
            stdout: logger(node, RED.settings.logging),
        };

        if (config.useLongpoll) {
            options.longPoll = 600000;
        }

        if (config.oAuthUrl === '') {
            delete options.oAuth;
        }

        try {
            node.zbc = new ZB.ZBClient(config.contactPoint, options);
        } catch (err) {
            node.error('Failed to create Zeebe client: ' + err.message);
            return;
        }

        node.on('close', function (done) {
            if (node.zbc) {
                return node.zbc.close().then(() => {
                    node.log('All workers closed');
                    done();
                }).catch((err) => {
                    node.error('Error closing Zeebe client: ' + err.message);
                    done();
                });
            } else {
                done();
            }
        });
    }

    RED.nodes.registerType('zeebe', Zeebe);
};
