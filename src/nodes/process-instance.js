const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function ProcessInstance(config) {
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

            try {
                const result = await this.zbc.createProcessInstance(
                    msg.payload.processId,
                    variables,
                );

                msg.payload = { ...msg.payload, ...result };

                node.send(msg);
                status.success(node, 'KEY:' + msg.payload.processInstanceKey);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                node.error(err);
            }
        });
    }

    RED.nodes.registerType('process-instance', ProcessInstance);
};
