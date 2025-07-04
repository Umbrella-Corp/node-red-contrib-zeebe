const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function ResolveIncident(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            // Input validation
            if (!msg.payload) {
                node.error('Missing payload in message', msg);
                status.error(node, 'Missing payload');
                return;
            }

            if (!msg.payload.incidentKey) {
                node.error('Missing incidentKey in payload', msg);
                status.error(node, 'Missing incidentKey');
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
                const result = await this.zbc.resolveIncident(
                    msg.payload.incidentKey,
                );

                // Add result to the existing message payload
                msg.payload = {
                    ...msg.payload,
                    result: result,
                    incidentResolved: true,
                    timestamp: new Date().toISOString(),
                };

                node.send(msg);
                status.success(node, `Incident resolved: ${msg.payload.incidentKey}`);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                node.error(err);
            }
        });
    }

    RED.nodes.registerType('resolve-incident', ResolveIncident);
};
