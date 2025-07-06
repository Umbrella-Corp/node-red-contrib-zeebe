#!/usr/bin/env python3
"""
Create high-quality FontAwesome-based icons for Camunda 8 nodes
"""
import os
import sys
from pathlib import Path
import requests
import json

# Color scheme (keeping the user's approved colors)
COLORS = {
    'process-instance': '#34a853',  # Green - Process Management
    'task-worker': '#ff9800',  # Orange - Task/Worker
    'complete-task': '#ff9800',  # Orange - Task/Worker
    'message': '#9c27b0',  # Purple - Messaging
    'start-message': '#9c27b0',  # Purple - Messaging
    'deploy': '#607d8b',  # Blue-Gray - Deployment
    'cancel-process-instance': '#f44336',  # Red - Operations
    'set-variables': '#34a853',  # Green - Process Management
    'broadcast-signal': '#9c27b0',  # Purple - Messaging
    'evaluate-decision': '#00bcd4',  # Cyan - Query/Monitoring
    'create-process-instance-with-result': '#34a853',  # Green - Process Management
    'throw-error': '#f44336',  # Red - Operations
    'operate-query': '#00bcd4',  # Cyan - Query/Monitoring
    'resolve-incident': '#ff9800',  # Orange - Task/Worker
    'topology': '#00bcd4',  # Cyan - Query/Monitoring
    'delete-resource': '#f44336',  # Red - Operations
    'tasklist-query': '#00bcd4',  # Cyan - Query/Monitoring
    'modify-process-instance': '#795548',  # Brown - Advanced/Admin
    'camunda': '#607d8b'  # Blue-Gray - General
}

# FontAwesome icon mapping
FONTAWESOME_ICONS = {
    'process-instance': 'play',
    'task-worker': 'user-cog',
    'complete-task': 'check-square',
    'message': 'envelope',
    'start-message': 'envelope-open',
    'deploy': 'rocket',
    'cancel-process-instance': 'stop-circle',
    'set-variables': 'edit',
    'broadcast-signal': 'broadcast-tower',
    'evaluate-decision': 'balance-scale',
    'create-process-instance-with-result': 'play-circle',
    'throw-error': 'exclamation-triangle',
    'operate-query': 'search',
    'resolve-incident': 'tools',
    'topology': 'sitemap',
    'delete-resource': 'trash',
    'tasklist-query': 'list-ul',
    'modify-process-instance': 'pen-square',
    'camunda': 'cogs'
}

def create_svg_icon(icon_name, fa_icon, color, size=40):
    """Create an SVG icon using FontAwesome paths"""
    # FontAwesome SVG paths (simplified versions for key icons)
    fa_paths = {
        'play': 'M8 5v14l11-7z',
        'user-cog': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8 z m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
        'check-square': 'M9 12l2 2 4-4 m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
        'envelope': 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z',
        'envelope-open': 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z',
        'rocket': 'M4.5 16.5c-1.5 1.5-1.5 4 0 5.5s4 1.5 5.5 0L12 20l2 2c1.5 1.5 4 1.5 5.5 0s1.5-4 0-5.5L17 14l-2-2 2-2c1.5-1.5 1.5-4 0-5.5s-4-1.5-5.5 0L10 6 8 4C6.5 2.5 4 2.5 2.5 4s-1.5 4 0 5.5L4.5 11.5',
        'stop-circle': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 13.5c-.83 0-1.5-.67-1.5-1.5v-4c0-.83.67-1.5 1.5-1.5h4c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-4z',
        'edit': 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
        'broadcast-tower': 'M4.93 4.93l4.24 4.24M19.07 4.93l-4.24 4.24M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M12 12l.01 0',
        'balance-scale': 'M12 3v18m-8-6l16 0M6 9l12 0m-6-6v6m-2 0h4',
        'play-circle': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z',
        'exclamation-triangle': 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
        'search': 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
        'tools': 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
        'sitemap': 'M22 11v-1a2 2 0 0 0-2-2h-4l-2-2H8l-2 2H2a2 2 0 0 0-2 2v1M22 11l-8-8-8 8',
        'trash': 'M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
        'list-ul': 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
        'pen-square': 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
        'cogs': 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'
    }
    
    # Use a fallback if path not found
    path = fa_paths.get(fa_icon, fa_paths['cogs'])
    
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="{path}"/>
</svg>'''
    
    return svg_content

def create_simple_svg_icon(icon_name, fa_icon, color, size=40):
    """Create a simple, clean SVG icon"""
    # Simple geometric shapes for better clarity
    simple_shapes = {
        'play': f'<polygon points="8,5 19,12 8,19" fill="{color}"/>',
        'user-cog': f'<circle cx="12" cy="7" r="4" fill="{color}"/><path d="M12 11v8m-4-4h8" stroke="{color}" stroke-width="2"/>',
        'check-square': f'<rect x="3" y="3" width="18" height="18" rx="2" fill="{color}"/><path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>',
        'envelope': f'<rect x="3" y="5" width="18" height="14" rx="2" fill="{color}"/><path d="M3 7l9 6 9-6" stroke="white" stroke-width="1.5" fill="none"/>',
        'envelope-open': f'<rect x="3" y="5" width="18" height="14" rx="2" fill="{color}"/><path d="M3 7l9 6 9-6" stroke="white" stroke-width="1.5" fill="none"/>',
        'rocket': f'<path d="M12 2L8 8h8l-4-6z" fill="{color}"/><rect x="10" y="8" width="4" height="12" fill="{color}"/><polygon points="6,16 10,16 10,20" fill="{color}"/><polygon points="14,16 18,16 14,20" fill="{color}"/>',
        'stop-circle': f'<circle cx="12" cy="12" r="9" fill="{color}"/><rect x="8" y="8" width="8" height="8" rx="1" fill="white"/>',
        'edit': f'<path d="M18 2l4 4-12 12-4 1 1-4L18 2z" fill="{color}"/><path d="M16 4l4 4" stroke="white" stroke-width="1.5"/>',
        'broadcast-tower': f'<rect x="11" y="2" width="2" height="20" fill="{color}"/><circle cx="12" cy="8" r="3" fill="none" stroke="{color}" stroke-width="2"/><circle cx="12" cy="8" r="6" fill="none" stroke="{color}" stroke-width="1.5"/>',
        'balance-scale': f'<rect x="11" y="2" width="2" height="20" fill="{color}"/><rect x="2" y="10" width="20" height="2" fill="{color}"/><circle cx="6" cy="16" r="3" fill="none" stroke="{color}" stroke-width="2"/><circle cx="18" cy="16" r="3" fill="none" stroke="{color}" stroke-width="2"/>',
        'play-circle': f'<circle cx="12" cy="12" r="9" fill="{color}"/><polygon points="10,8 10,16 16,12" fill="white"/>',
        'exclamation-triangle': f'<polygon points="12,2 22,20 2,20" fill="{color}"/><path d="M12 9v4M12 17h.01" stroke="white" stroke-width="2" stroke-linecap="round"/>',
        'search': f'<circle cx="11" cy="11" r="8" fill="none" stroke="{color}" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="{color}" stroke-width="2" stroke-linecap="round"/>',
        'tools': f'<rect x="6" y="6" width="12" height="12" rx="2" fill="{color}" transform="rotate(45 12 12)"/><rect x="3" y="3" width="6" height="6" rx="1" fill="{color}"/>',
        'sitemap': f'<rect x="9" y="3" width="6" height="4" rx="1" fill="{color}"/><rect x="3" y="15" width="6" height="4" rx="1" fill="{color}"/><rect x="15" y="15" width="6" height="4" rx="1" fill="{color}"/><path d="M12 7v4M12 11h-6M12 11h6M6 11v4M18 11v4" stroke="{color}" stroke-width="2"/>',
        'trash': f'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="{color}" stroke-width="2" fill="none"/><rect x="5" y="6" width="14" height="14" rx="2" fill="{color}"/>',
        'list-ul': f'<circle cx="4" cy="7" r="1" fill="{color}"/><circle cx="4" cy="12" r="1" fill="{color}"/><circle cx="4" cy="17" r="1" fill="{color}"/><rect x="8" y="6" width="12" height="2" fill="{color}"/><rect x="8" y="11" width="12" height="2" fill="{color}"/><rect x="8" y="16" width="12" height="2" fill="{color}"/>',
        'pen-square': f'<rect x="3" y="3" width="18" height="18" rx="2" fill="{color}"/><path d="M12 8l4 4-8 8H4v-4l8-8z" fill="white"/>',
        'cogs': f'<circle cx="12" cy="12" r="3" fill="{color}"/><circle cx="12" cy="12" r="7" fill="none" stroke="{color}" stroke-width="2"/><rect x="11" y="2" width="2" height="4" fill="{color}"/><rect x="11" y="18" width="2" height="4" fill="{color}"/><rect x="2" y="11" width="4" height="2" fill="{color}"/><rect x="18" y="11" width="4" height="2" fill="{color}"/>'
    }
    
    shape = simple_shapes.get(fa_icon, simple_shapes['cogs'])
    
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24">
    {shape}
</svg>'''
    
    return svg_content

def create_all_icons():
    """Create all icons in both SVG and PNG formats"""
    
    # Create directories
    svg_dir = Path('/tmp/svg_icons')
    png_dir = Path('/tmp/png_icons')
    svg_dir.mkdir(exist_ok=True)
    png_dir.mkdir(exist_ok=True)
    
    print("Creating high-quality FontAwesome-based icons...")
    
    for node_name, fa_icon in FONTAWESOME_ICONS.items():
        color = COLORS[node_name]
        
        # Create SVG (48x48 for high quality)
        svg_content = create_simple_svg_icon(node_name, fa_icon, color, 48)
        svg_path = svg_dir / f"{node_name}.svg"
        
        with open(svg_path, 'w') as f:
            f.write(svg_content)
        
        print(f"Created SVG: {node_name}.svg")
        
        # Convert to PNG using cairosvg if available, otherwise use simple approach
        try:
            # Try to use cairosvg for better quality
            import cairosvg
            png_path = png_dir / f"{node_name}.png"
            cairosvg.svg2png(url=str(svg_path), write_to=str(png_path), output_width=48, output_height=48)
            print(f"Created PNG: {node_name}.png")
        except ImportError:
            print(f"cairosvg not available, SVG created: {node_name}.svg")
    
    print(f"\nCreated {len(FONTAWESOME_ICONS)} icons")
    print(f"SVG icons: {svg_dir}")
    print(f"PNG icons: {png_dir}")

if __name__ == "__main__":
    create_all_icons()