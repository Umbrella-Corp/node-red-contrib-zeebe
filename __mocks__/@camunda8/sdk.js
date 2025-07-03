const mockJob = { key: '111', variables: {} ,
    complete: jest.fn(),
    fail: jest.fn(),
    error: jest.fn(),
    forward: jest.fn(),
};

const mockZeebeClient = {
    createWorker: ({
        // eslint-disable-next-line no-unused-vars
        taskType,
        taskHandler,
        // eslint-disable-next-line no-unused-vars
        ...workerOptions
    }) => {
        // call the handler asynchronously right after ZBClient has been created
        setTimeout(() => taskHandler(mockJob));
        return {
            close: () => Promise.resolve(),
        };
    },
    publishMessage: jest.fn(),
    publishStartMessage: jest.fn(),
    deployResource: jest.fn().mockResolvedValue({ bpmnProcessId: 'my-process' }),
    createProcessInstance: jest.fn(),
    close: () => {},
};

exports.Camunda8 = jest.fn().mockImplementation(() => {
    return {
        getZeebeGrpcApiClient: jest.fn().mockReturnValue(mockZeebeClient),
    };
});
