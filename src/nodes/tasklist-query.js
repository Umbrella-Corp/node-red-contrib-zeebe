const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function TasklistQuery(config) {
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
            if (!camundaConfig || !camundaConfig.tasklist) {
                node.error('Invalid or missing Camunda configuration with Tasklist API', msg);
                status.error(node, 'No Tasklist connection');
                return;
            }

            try {
                const tasklist = camundaConfig.tasklist;

                // Build query based on payload parameters
                const query = {};

                if (msg.payload.assignee) {
                    query.assignee = msg.payload.assignee;
                }

                if (msg.payload.state) {
                    query.state = msg.payload.state;
                }

                if (msg.payload.processDefinitionKey) {
                    query.processDefinitionKey = msg.payload.processDefinitionKey;
                }

                if (msg.payload.taskDefinitionId) {
                    query.taskDefinitionId = msg.payload.taskDefinitionId;
                }

                // Query tasks
                const result = await tasklist.searchTasks(query);

                // Add result to the existing message payload
                msg.payload = {
                    ...msg.payload,
                    result: result,
                    queryExecuted: true,
                    timestamp: new Date().toISOString(),
                };

                node.send(msg);
                status.success(node, `Tasks queried: ${result.items ? result.items.length : 0} tasks`);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                node.error(err);
            }
        });
    }

    RED.nodes.registerType('tasklist-query', TasklistQuery);
};
