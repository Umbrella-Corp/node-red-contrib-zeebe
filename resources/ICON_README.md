# FontAwesome-Based Icon System for Camunda 8 Nodes

This directory contains high-quality icons based on FontAwesome designs for all 19 Camunda 8 nodes.

## Features

- **High Resolution**: 48x48 PNG icons (upgraded from 24x24)
- **FontAwesome Based**: Icons use clean, professional FontAwesome designs
- **Dual Format**: Both SVG and PNG versions available
- **Color-Coded**: Each icon uses the node's category color for better visual consistency

## Icon Mapping

| Node | FontAwesome Icon | Category | Color |
|------|------------------|----------|-------|
| process-instance | fa-play | Process Management | #34a853 |
| task-worker | fa-user-cog | Task/Worker | #ff9800 |
| complete-task | fa-check-square | Task/Worker | #ff9800 |
| message | fa-envelope | Messaging | #9c27b0 |
| start-message | fa-envelope-open | Messaging | #9c27b0 |
| deploy | fa-rocket | Deployment | #607d8b |
| cancel-process-instance | fa-stop-circle | Operations | #f44336 |
| set-variables | fa-edit | Process Management | #34a853 |
| broadcast-signal | fa-broadcast-tower | Messaging | #9c27b0 |
| evaluate-decision | fa-balance-scale | Query/Monitoring | #00bcd4 |
| create-process-instance-with-result | fa-play-circle | Process Management | #34a853 |
| throw-error | fa-exclamation-triangle | Operations | #f44336 |
| operate-query | fa-search | Query/Monitoring | #00bcd4 |
| resolve-incident | fa-tools | Task/Worker | #ff9800 |
| topology | fa-sitemap | Query/Monitoring | #00bcd4 |
| delete-resource | fa-trash | Operations | #f44336 |
| tasklist-query | fa-list-ul | Query/Monitoring | #00bcd4 |
| modify-process-instance | fa-pen-square | Advanced/Admin | #795548 |
| camunda | fa-cogs | General | #607d8b |

## File Structure

```
src/nodes/icons/
├── *.png          # 48x48 PNG icons for Node-RED
└── *.svg          # SVG source files (for future use)

resources/
├── *.png          # Backup PNG icons
├── *.svg          # Backup SVG icons
└── create_fontawesome_icons.py  # Icon generation script
```

## Generation Script

The `create_fontawesome_icons.py` script can regenerate all icons:

```bash
cd resources
python3 create_fontawesome_icons.py
```

This creates both SVG and PNG versions in higher resolution based on FontAwesome designs.

## Quality Improvements

1. **Resolution**: Upgraded from 24x24 to 48x48 pixels for better clarity
2. **Design**: Professional FontAwesome-based icons instead of custom drawings  
3. **Consistency**: All icons follow the same design language
4. **Scalability**: SVG versions available for future high-DPI support

## Node-RED Compatibility

- PNG format ensures maximum compatibility with all Node-RED versions
- 48x48 resolution is well-supported and provides crisp display
- SVG versions available for future Node-RED versions that support them
- Maintains the same color scheme approved in the original design