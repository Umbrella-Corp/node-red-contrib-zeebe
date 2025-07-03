const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function CompleteTask(config) {
        RED.nodes.createNode(this, config);

        const node = this;

        node.on('input', async function (msg) {
            // Input validation
            if (!msg.payload) {
                node.error('Missing payload in message', msg);
                status.error(node, 'Missing payload');
                return;
            }

            const {
                job,
                variables,
                type,
                failureMessage,
                errorCode,
                errorMessage,
            } = msg.payload;

            // Validate required job object
            if (!job) {
                node.error('Missing job object in payload', msg);
                status.error(node, 'Missing job');
                return;
            }

            // Validate job has required methods
            if (typeof job.complete !== 'function' ||
                typeof job.fail !== 'function' ||
                typeof job.error !== 'function') {
                node.error('Invalid job object - missing required methods', msg);
                status.error(node, 'Invalid job');
                return;
            }

            try {
                if (type === 'failure') {
                    await job.fail(failureMessage || '');
                    status.warning(node, failureMessage || 'Failure');
                } else if (type === 'error') {
                    if (!errorCode || !errorMessage) {
                        node.error('Missing errorCode or errorMessage for error type', msg);
                        status.error(node, 'Missing error details');
                        return;
                    }
                    await job.error({ errorCode, errorMessage, variables });
                    status.clear(node);
                } else {
                    // Default to complete
                    await job.complete(variables);
                    status.clear(node);
                }
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
            }
        });
    }
    RED.nodes.registerType('complete-task', CompleteTask);
};
