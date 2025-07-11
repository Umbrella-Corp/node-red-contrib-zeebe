const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function EvaluateDecision(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            // Input validation
            if (!msg.payload) {
                node.error('Missing payload in message', msg);
                status.error(node, 'Missing payload');
                return;
            }

            if (!msg.payload.decisionId) {
                node.error('Missing decisionId in payload', msg);
                status.error(node, 'Missing decisionId');
                return;
            }

            if (!msg.payload.variables) {
                node.error('Missing variables in payload', msg);
                status.error(node, 'Missing variables');
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
                const result = await this.zbc.evaluateDecision({
                    decisionId: msg.payload.decisionId,
                    variables: msg.payload.variables,
                });

                // Add result to the existing message payload
                msg.payload = {
                    ...msg.payload,
                    result: result,
                    decisionEvaluated: true,
                    timestamp: new Date().toISOString(),
                };

                node.send(msg);
                status.success(node, `Decision evaluated: ${msg.payload.decisionId}`);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                node.error(err);
            }
        });
    }

    RED.nodes.registerType('evaluate-decision', EvaluateDecision);
};
