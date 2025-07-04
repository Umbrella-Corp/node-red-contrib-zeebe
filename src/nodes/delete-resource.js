const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function DeleteResource(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            // Input validation
            if (!msg.payload) {
                node.error('Missing payload in message', msg);
                status.error(node, 'Missing payload');
                return;
            }

            if (!msg.payload.resourceKey) {
                node.error('Missing resourceKey in payload', msg);
                status.error(node, 'Missing resourceKey');
                return;
            }

            // Validate camunda connection
            const camundaConfig = RED.nodes.getNode(config.camunda);
            if (!camundaConfig || !camundaConfig.zbc) {
                node.error('Invalid or missing Camunda configuration', msg);
                status.error(node, 'No Camunda connection');
                return;
            }

            this.zbc = camundaConfig.zbc;

            try {
                const result = await this.zbc.deleteResource(
                    msg.payload.resourceKey,
                );

                // Add result to the existing message payload
                msg.payload = {
                    ...msg.payload,
                    result: result,
                    resourceDeleted: true,
                    timestamp: new Date().toISOString(),
                };

                node.send(msg);
                status.success(node, `Resource deleted: ${msg.payload.resourceKey}`);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                node.error(err);
            }
        });
    }

    RED.nodes.registerType('delete-resource', DeleteResource);
};
