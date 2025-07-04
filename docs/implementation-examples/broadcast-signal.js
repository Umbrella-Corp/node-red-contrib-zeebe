const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function BroadcastSignal(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            // Input validation
            if (!msg.payload) {
                node.error('Missing payload in message', msg);
                status.error(node, 'Missing payload');
                return;
            }

            if (!msg.payload.signalName) {
                node.error('Missing signalName in payload', msg);
                status.error(node, 'Missing signalName');
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

            // Prepare signal payload
            const signalPayload = {
                signalName: msg.payload.signalName,
            };

            // Add variables if provided
            if (msg.payload.variables) {
                signalPayload.variables = msg.payload.variables;
            }

            try {
                const result = await this.zbc.broadcastSignal(signalPayload);

                // Add result to the existing message payload
                msg.payload = {
                    ...msg.payload,
                    result: result,
                    signalBroadcast: true,
                    timestamp: new Date().toISOString(),
                };

                node.send(msg);
                status.success(node, `Signal broadcast: ${msg.payload.signalName}`);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                node.error(err);
            }
        });
    }

    RED.nodes.registerType('broadcast-signal', BroadcastSignal);
};
