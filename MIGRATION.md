# Migration Notes

## Migration to Camunda 8 SDK - COMPLETED ✅

This project has been successfully migrated from the deprecated `zeebe-node` package to the official `@camunda8/sdk` package.

### What Changed

- **Dependency**: Replaced `zeebe-node@8.3.2` with `@camunda8/sdk@^8.7.17`
- **Client Initialization**: Updated from `new ZB.ZBClient()` to `new Camunda8().getZeebeGrpcApiClient()`
- **Configuration Mapping**: Mapped Node-RED configuration to Camunda8 SDK format
- **API Compatibility**: All existing Node-RED node functionality remains unchanged

### Backward Compatibility

The migration maintains full backward compatibility for Node-RED users:
- All node configurations remain the same
- All input/output message formats are unchanged
- All functionality works identically to the previous version

### Benefits of Migration

- **Security**: Using the official, maintained Camunda 8 SDK
- **Updates**: Will receive ongoing security and feature updates
- **Support**: Official support from Camunda for the SDK
- **Future-proof**: Compatibility with newer Zeebe versions

## Security Updates
While the deprecated package still functions, monitoring for security advisories is crucial. Consider updating to the official SDK when a major version bump is planned.