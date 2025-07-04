const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function OperateQuery(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            // Input validation
            if (!msg.payload) {
                node.error('Missing payload in message', msg);
                status.error(node, 'Missing payload');
                return;
            }

            // Validate camunda connection
            const camundaConfig = RED.nodes.getNode(config.camunda);
            if (!camundaConfig || !camundaConfig.operate) {
                node.error('Invalid or missing Camunda configuration with Operate API', msg);
                status.error(node, 'No Operate connection');
                return;
            }

            try {
                const operate = camundaConfig.operate;

                // Build query based on payload parameters
                const query = {};

                if (msg.payload.processDefinitionKey) {
                    query.processDefinitionKey = msg.payload.processDefinitionKey;
                }

                if (msg.payload.state) {
                    query.state = msg.payload.state;
                }

                if (msg.payload.startDate || msg.payload.endDate) {
                    query.dateRange = {};
                    if (msg.payload.startDate) query.dateRange.start = msg.payload.startDate;
                    if (msg.payload.endDate) query.dateRange.end = msg.payload.endDate;
                }

                // Query process instances
                const result = await operate.searchProcessInstances(query);

                // Add result to the existing message payload
                msg.payload = {
                    ...msg.payload,
                    result: result,
                    queryExecuted: true,
                    timestamp: new Date().toISOString(),
                };

                node.send(msg);
                status.success(node, `Query executed: ${result.items ? result.items.length : 0} instances`);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                node.error(err);
            }
        });
    }

    RED.nodes.registerType('operate-query', OperateQuery);
};
