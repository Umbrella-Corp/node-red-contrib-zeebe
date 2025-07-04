const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function ThrowError(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            // Input validation
            if (!msg.payload) {
                node.error('Missing payload in message', msg);
                status.error(node, 'Missing payload');
                return;
            }

            if (!msg.payload.jobKey) {
                node.error('Missing jobKey in payload', msg);
                status.error(node, 'Missing jobKey');
                return;
            }

            if (!msg.payload.errorCode) {
                node.error('Missing errorCode in payload', msg);
                status.error(node, 'Missing errorCode');
                return;
            }

            if (!msg.payload.errorMessage) {
                node.error('Missing errorMessage in payload', msg);
                status.error(node, 'Missing errorMessage');
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
                const result = await this.zbc.throwError({
                    jobKey: msg.payload.jobKey,
                    errorCode: msg.payload.errorCode,
                    errorMessage: msg.payload.errorMessage,
                    variables: msg.payload.variables || {},
                });

                // Add result to the existing message payload
                msg.payload = {
                    ...msg.payload,
                    result: result,
                    errorThrown: true,
                    timestamp: new Date().toISOString(),
                };

                node.send(msg);
                status.success(node, `Error thrown: ${msg.payload.errorCode}`);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                node.error(err);
            }
        });
    }

    RED.nodes.registerType('throw-error', ThrowError);
};
