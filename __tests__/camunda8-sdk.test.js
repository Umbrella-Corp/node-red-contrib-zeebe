// Test the actual Camunda8 SDK import without mocks
describe('Camunda8 SDK Import Test', () => {
    beforeAll(() => {
        // Disable mocks for this test
        jest.unmock('@camunda8/sdk');
    });

    it('should be able to import and create Camunda8 instance', () => {
        // Clear module cache to ensure fresh import
        delete require.cache[require.resolve('@camunda8/sdk')];

        const { Camunda8 } = require('@camunda8/sdk');

        expect(Camunda8).toBeDefined();
        expect(typeof Camunda8).toBe('function');

        // Test that we can create an instance with minimal config
        const config = {
            ZEEBE_GRPC_ADDRESS: 'localhost:26500',
            CAMUNDA_SECURE_CONNECTION: false,
            ZEEBE_CLIENT_ID: 'test',
            ZEEBE_CLIENT_SECRET: 'test',
            CAMUNDA_OAUTH_URL: 'http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token',
        };

        const c8 = new Camunda8(config);
        expect(c8).toBeDefined();

        const zeebe = c8.getZeebeGrpcApiClient();
        expect(zeebe).toBeDefined();
        expect(typeof zeebe.deployResource).toBe('function');
        expect(typeof zeebe.createProcessInstance).toBe('function');
        expect(typeof zeebe.createWorker).toBe('function');
        expect(typeof zeebe.publishMessage).toBe('function');
        expect(typeof zeebe.close).toBe('function');
    });
});
