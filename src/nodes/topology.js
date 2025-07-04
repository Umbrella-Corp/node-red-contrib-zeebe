const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function Topology(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            // Validate camunda connection
            const camundaConfig = RED.nodes.getNode(config.camunda);
            if (!camundaConfig || !camundaConfig.zbc) {
                node.error('Invalid or missing Camunda configuration', msg);
                status.error(node, 'No Camunda connection');
                return;
            }

            this.zbc = camundaConfig.zbc;

            try {
                const result = await this.zbc.topology();

                // Create or update payload with topology information
                msg.payload = {
                    ...msg.payload,
                    topology: result,
                    timestamp: new Date().toISOString(),
                };

                node.send(msg);
                status.success(node, `Topology: ${result.brokers ? result.brokers.length : 0} brokers`);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                node.error(err);
            }
        });
    }

    RED.nodes.registerType('topology', Topology);
};
