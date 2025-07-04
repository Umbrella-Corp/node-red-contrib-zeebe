const helper = require('node-red-node-test-helper');
const cancelProcessInstanceNode = require('../src/nodes/cancel-process-instance');
const setVariablesNode = require('../src/nodes/set-variables');
const broadcastSignalNode = require('../src/nodes/broadcast-signal');
const camundaNode = require('../src/nodes/camunda');

helper.init(require.resolve('node-red'));

describe('New Camunda 8 Nodes', () => {
    beforeEach((done) => {
        helper.startServer(done);
    });

    afterEach((done) => {
        helper.unload();
        helper.stopServer(done);
    });

    describe('cancel-process-instance node', () => {
        it('should be loaded', (done) => {
            const flow = [{ id: 'n1', type: 'cancel-process-instance', name: 'cancel-process-instance' }];
            helper.load(cancelProcessInstanceNode, flow, () => {
                const n1 = helper.getNode('n1');
                expect(n1.name).toBe('cancel-process-instance');
                done();
            });
        });

        it('should handle missing payload', (done) => {
            const flow = [
                { id: 'n1', type: 'cancel-process-instance', name: 'cancel-process-instance', wires: [['n2']] },
                { id: 'n2', type: 'helper' },
            ];
            helper.load(cancelProcessInstanceNode, flow, () => {
                const n1 = helper.getNode('n1');
                const n2 = helper.getNode('n2');
                
                n1.on('call:error', (msg) => {
                    expect(msg.toString()).toContain('Missing payload');
                    done();
                });
                
                n1.receive({});
            });
        });

        it('should handle missing processInstanceKey', (done) => {
            const flow = [
                { id: 'n1', type: 'cancel-process-instance', name: 'cancel-process-instance', wires: [['n2']] },
                { id: 'n2', type: 'helper' },
            ];
            helper.load(cancelProcessInstanceNode, flow, () => {
                const n1 = helper.getNode('n1');
                
                n1.on('call:error', (msg) => {
                    expect(msg.toString()).toContain('Missing processInstanceKey');
                    done();
                });
                
                n1.receive({ payload: {} });
            });
        });
    });

    describe('set-variables node', () => {
        it('should be loaded', (done) => {
            const flow = [{ id: 'n1', type: 'set-variables', name: 'set-variables' }];
            helper.load(setVariablesNode, flow, () => {
                const n1 = helper.getNode('n1');
                expect(n1.name).toBe('set-variables');
                done();
            });
        });

        it('should handle missing variables', (done) => {
            const flow = [
                { id: 'n1', type: 'set-variables', name: 'set-variables', wires: [['n2']] },
                { id: 'n2', type: 'helper' },
            ];
            helper.load(setVariablesNode, flow, () => {
                const n1 = helper.getNode('n1');
                
                n1.on('call:error', (msg) => {
                    expect(msg.toString()).toContain('Missing variables');
                    done();
                });
                
                n1.receive({ payload: { processInstanceKey: '123' } });
            });
        });
    });

    describe('broadcast-signal node', () => {
        it('should be loaded', (done) => {
            const flow = [{ id: 'n1', type: 'broadcast-signal', name: 'broadcast-signal' }];
            helper.load(broadcastSignalNode, flow, () => {
                const n1 = helper.getNode('n1');
                expect(n1.name).toBe('broadcast-signal');
                done();
            });
        });

        it('should handle missing signalName', (done) => {
            const flow = [
                { id: 'n1', type: 'broadcast-signal', name: 'broadcast-signal', wires: [['n2']] },
                { id: 'n2', type: 'helper' },
            ];
            helper.load(broadcastSignalNode, flow, () => {
                const n1 = helper.getNode('n1');
                
                n1.on('call:error', (msg) => {
                    expect(msg.toString()).toContain('Missing signalName');
                    done();
                });
                
                n1.receive({ payload: {} });
            });
        });
    });
});