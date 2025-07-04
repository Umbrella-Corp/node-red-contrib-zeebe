const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function CreateProcessInstanceWithResult(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            // Input validation
            if (!msg.payload) {
                node.error('Missing payload in message', msg);
                status.error(node, 'Missing payload');
                return;
            }

            if (!msg.payload.processId) {
                node.error('Missing processId in payload', msg);
                status.error(node, 'Missing processId');
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
            const variables = msg.payload.variables || {};
            const timeout = msg.payload.timeout || 30000; // Default 30 seconds

            try {
                const result = await this.zbc.createProcessInstanceWithResult({
                    bpmnProcessId: msg.payload.processId,
                    variables: variables,
                    requestTimeout: timeout,
                });

                // Add result to the existing message payload
                msg.payload = {
                    ...msg.payload,
                    result: result,
                    processCompleted: true,
                    timestamp: new Date().toISOString(),
                };

                node.send(msg);
                status.success(node, `Process completed: ${msg.payload.processId}`);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                node.error(err);
            }
        });
    }

    RED.nodes.registerType('create-process-instance-with-result', CreateProcessInstanceWithResult);
};
