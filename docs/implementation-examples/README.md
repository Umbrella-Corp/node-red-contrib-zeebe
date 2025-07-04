# Implementation Examples

This directory contains complete implementation examples for the recommended new Node-RED nodes. Each example includes:

## File Structure
- `{node-name}.js` - Node implementation following existing patterns
- `{node-name}.html` - HTML template and help documentation  
- `{node-name}_spec.js` - Jest test file with comprehensive test cases

## Implementation Pattern
All examples follow the established patterns in the existing codebase:

### Common Structure
1. **Input Validation** - Validate required payload fields
2. **Connection Validation** - Check Camunda configuration and client
3. **Zeebe API Call** - Execute the appropriate SDK method
4. **Result Handling** - Add results to message payload and forward
5. **Error Handling** - Proper error logging and status reporting

### Status Management
- Uses the shared `status` utility for consistent node status display
- Shows "Connecting...", "Connected", "Error", etc. states

### Message Flow
- Maintains existing message structure
- Adds results to `msg.payload` without destroying original data
- Includes timestamps and operation confirmation flags

## Testing Strategy
Tests follow the existing Jest/Node-RED helper pattern:
- Mock Zeebe client methods
- Test successful operations
- Test error conditions
- Test input validation

## Usage Examples

### Cancel Process Instance
```javascript
msg.payload = {
    processInstanceKey: "12345678901234567"
};
```

### Set Variables
```javascript
msg.payload = {
    processInstanceKey: "12345678901234567",
    variables: {
        customerStatus: "premium",
        discountRate: 0.15
    },
    local: false  // optional, defaults to false
};
```

### Broadcast Signal
```javascript
msg.payload = {
    signalName: "market_update",
    variables: {
        marketPrice: 100.50,
        timestamp: new Date().toISOString()
    }
};
```

### Evaluate Decision
```javascript
msg.payload = {
    decisionId: "loan_approval",
    variables: {
        creditScore: 750,
        loanAmount: 50000,
        income: 80000
    }
};
```

## Integration Notes

### Package.json Updates
Add new nodes to the `node-red.nodes` section:
```json
{
  "node-red": {
    "nodes": {
      "cancel-process-instance": "src/nodes/cancel-process-instance.js",
      "set-variables": "src/nodes/set-variables.js",
      "broadcast-signal": "src/nodes/broadcast-signal.js",
      "evaluate-decision": "src/nodes/evaluate-decision.js"
    }
  }
}
```

### Icon Considerations
All examples use the existing `camunda.png` icon for consistency. Consider creating specific icons for each node type in the future.

### Error Patterns
All nodes follow consistent error handling:
- Input validation errors logged with context
- Connection errors show appropriate status
- API errors propagated with full error details
- Status cleared on successful operations

### Dependencies
No additional dependencies required beyond:
- Existing `@camunda8/sdk` 
- Existing utility modules (`nodeStatus`, etc.)
- Standard Node-RED patterns

These examples provide a complete foundation for implementing any of the recommended nodes with minimal adaptation needed.