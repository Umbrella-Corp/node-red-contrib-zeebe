# Migration Notes

## Deprecated Dependencies

### zeebe-node Package
The current dependency `zeebe-node@8.3.2` is deprecated. The maintainers recommend migrating to the official Camunda 8 SDK package `@camunda8/sdk`.

#### Migration Considerations
- The new SDK may have different API patterns
- Breaking changes in client initialization
- Different authentication mechanisms
- Updated method signatures

#### Current Status
- Package continues to work but will not receive updates
- Security vulnerabilities may not be patched
- Future compatibility with newer Zeebe versions uncertain

#### Recommended Action
- Evaluate migration to `@camunda8/sdk` in a future release
- Test compatibility with existing workflows
- Update documentation and examples
- Consider backward compatibility requirements

## Security Updates
While the deprecated package still functions, monitoring for security advisories is crucial. Consider updating to the official SDK when a major version bump is planned.