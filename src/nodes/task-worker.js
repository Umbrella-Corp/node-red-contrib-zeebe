const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function TaskWorker(config) {
        RED.nodes.createNode(this, config);

        const node = this;

        // Validate configuration
        if (!config.zeebe) {
            node.error('Missing Zeebe configuration');
            status.error(node, 'Missing Zeebe config');
            return;
        }

        if (!config.taskType) {
            node.error('Missing task type configuration');
            status.error(node, 'Missing task type');
            return;
        }

        const zeebeConfig = RED.nodes.getNode(config.zeebe);
        if (!zeebeConfig) {
            node.error('Invalid Zeebe configuration reference');
            status.error(node, 'Invalid Zeebe config');
            return;
        }

        const zbc = zeebeConfig.zbc;
        if (!zbc) {
            node.error('Zeebe client not available');
            status.error(node, 'No Zeebe client');
            return;
        }

        // assume the worker is connected, once the client is connected. this will be obsolete,
        // once https://github.com/creditsenseau/zeebe-client-node-js/issues/97 is fixed
        zeebeConfig.once('ready', () => {
            status.success(node, 'Connected');
        });

        zeebeConfig.once('connectionError', () => {
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
