/**
 * Node-RED Zeebe Contribution Package
 *
 * This package provides Node-RED nodes for integrating with Zeebe workflow engine.
 *
 * Security Considerations:
 * - Always validate input payloads before processing
 * - Use proper authentication with OAuth when connecting to Zeebe
 * - Sanitize error messages to avoid information disclosure
 * - Monitor and log security-relevant events
 * - Keep dependencies updated to avoid known vulnerabilities
 *
 * Performance Considerations:
 * - Workers are properly closed on node shutdown to prevent resource leaks
 * - Connection pooling is handled by the zeebe-node client
 * - Input validation happens early to avoid unnecessary processing
 *
 * @module node-red-contrib-zeebe-2
 */

module.exports = {
    name: 'node-red-contrib-zeebe-2',
    version: require('./package.json').version,
    description: 'Zeebe nodes for Node-RED',
};
