const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function TaskWorker(config) {
        RED.nodes.createNode(this, config);

        const node = this;

        // Validate configuration
        if (!config.camunda) {
            node.error('Missing Camunda configuration');
            status.error(node, 'Missing Camunda config');
            return;
        }

        if (!config.taskType) {
            node.error('Missing task type configuration');
            status.error(node, 'Missing task type');
            return;
        }

        const camundaConfig = RED.nodes.getNode(config.camunda);
        if (!camundaConfig) {
            node.error('Invalid Camunda configuration reference');
            status.error(node, 'Invalid Camunda config');
            return;
        }

        const zbc = camundaConfig.zbc;
        if (!zbc) {
            node.error('Zeebe client not available');
            status.error(node, 'No Zeebe client');
            return;
        }

        // assume the worker is connected, once the client is connected. this will be obsolete,
        // once https://github.com/creditsenseau/zeebe-client-node-js/issues/97 is fixed
        camundaConfig.once('ready', () => {
            status.success(node, 'Connected');
        });

        camundaConfig.once('connectionError', () => {
            status.error(node, 'Connection Error');
        });

        status.warning(node, 'Connecting...');

        const handler = (job) => {
            node.send({
                payload: {
                    job,
                },
            });
        };

        const workerOptions = {
            onReady: () => {
                node.debug('Connected');
                status.success(node, 'Connected');
            },
            onConnectionError: () => {
                node.debug('Connection Error');
                status.error(node, 'Connection Error');
            },
        };

        if (config.maxActiveJobs !== '') {
            workerOptions.maxActiveJobs = parseInt(config.maxActiveJobs, 10);
        }

        if (config.timeout !== '') {
            workerOptions.timeout = parseInt(config.timeout, 10);
        }

        let zbWorker;
        try {
            zbWorker = zbc.createWorker({
                taskType: config.taskType,
                taskHandler: handler,
                ...workerOptions,
            });
        } catch (err) {
            node.error('Failed to create worker: ' + err.message);
            status.error(node, 'Worker creation failed');
            return;
        }

        node.on('close', (done) => {
            if (zbWorker) {
                zbWorker.close().then(() => {
                    node.debug('Worker closed successfully');
                    if (done) done();
                }).catch((err) => {
                    node.error('Error closing worker: ' + err.message);
                    if (done) done();
                });
            } else if (done) {
                done();
            }
        });
    }
    RED.nodes.registerType('task-worker', TaskWorker);
};
