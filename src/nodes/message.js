const status = require('../util/nodeStatus');
const { v4: uuidv4 } = require('uuid');

module.exports = function (RED) {
    function Message(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        this.zbc = RED.nodes.getNode(config.camunda).zbc;

        node.on('input', function (msg) {
            // Input validation
            if (!msg.payload) {
                node.error('Missing payload in message', msg);
                status.error(node, 'Missing payload');
                return;
            }

            if (!msg.payload.name) {
                node.error('Missing message name in payload', msg);
                status.error(node, 'Missing message name');
                return;
            }

            const message = { ...msg.payload, messageId: uuidv4() };

            try {
                this.zbc.publishMessage(message);
                status.clear(node);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
            }
        });
    }
    RED.nodes.registerType('message', Message);
};
