const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function Deploy(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            // Input validation
            if (!msg.payload) {
                node.error('Missing payload in message', msg);
                status.error(node, 'Missing payload');
                return;
            }

            const { resourceType, resourceName, definition } = msg.payload;

            // Validate required fields
            if (!definition) {
                node.error('Missing definition in payload', msg);
                status.error(node, 'Missing definition');
                return;
            }

            if (!resourceName) {
                node.error('Missing resourceName in payload', msg);
                status.error(node, 'Missing resourceName');
                return;
            }

            // Validate zeebe connection
            const zeebeConfig = RED.nodes.getNode(config.zeebe);
            if (!zeebeConfig || !zeebeConfig.zbc) {
                node.error('Invalid or missing Zeebe configuration', msg);
                status.error(node, 'No Zeebe connection');
                return;
            }

            this.zbc = zeebeConfig.zbc;
            let res;
            try {
                if (resourceType === 'process') {
                    res = await this.zbc.deployResource({
                        process: Buffer.from(definition),
                        name: resourceName,
                    });
                } else if (resourceType === 'decision') {
                    res = await this.zbc.deployResource({
                        decision: Buffer.from(definition),
                        name: resourceName,
                    });
                } else {
                    // Default to process if no type specified
                    res = await this.zbc.deployResource({
                        process: Buffer.from(definition),
                        name: resourceName,
                    });
                }
                status.success(node, 'Deployed');
                msg.payload = res;
                node.send(msg);
            } catch (e) {
                node.error(e.message, msg);
                status.error(node, 'Deploy error');
            }
        });
    }

    RED.nodes.registerType('deploy', Deploy);
};
