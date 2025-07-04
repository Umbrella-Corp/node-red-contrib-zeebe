#!/usr/bin/env python3
"""
Script to create 24x24px PNG icons for Camunda 8 nodes.
Uses simple geometric shapes to represent each node's function.
"""

import os
from PIL import Image, ImageDraw

def create_icon(name, color, draw_func):
    """Create a 24x24px PNG icon with the specified color and drawing function."""
    # Create a 24x24 image with transparent background
    img = Image.new('RGBA', (24, 24), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw the icon shape
    draw_func(draw, color)
    
    # Save the icon
    img.save(f'{name}.png')
    print(f'Created {name}.png')

def draw_gear(draw, color):
    """Draw a gear icon for configuration"""
    # Simple gear shape using rectangles
    center = (12, 12)
    for i in range(8):
        angle = i * 45
        x = center[0] + 6 * (1 if i % 2 == 0 else 0.7)
        y = center[1] + 6 * (1 if i % 2 == 0 else 0.7)
        draw.rectangle([x-1, y-1, x+1, y+1], fill=color)
    # Center circle
    draw.ellipse([8, 8, 16, 16], fill=color)
    draw.ellipse([10, 10, 14, 14], fill=(255, 255, 255, 0))

def draw_play(draw, color):
    """Draw a play triangle"""
    draw.polygon([(6, 4), (6, 20), (20, 12)], fill=color)

def draw_worker(draw, color):
    """Draw a simple person icon"""
    # Head
    draw.ellipse([9, 4, 15, 10], fill=color)
    # Body
    draw.rectangle([8, 10, 16, 20], fill=color)

def draw_check(draw, color):
    """Draw a checkmark"""
    draw.polygon([(4, 12), (8, 16), (20, 4), (18, 2), (8, 12), (6, 10)], fill=color)

def draw_envelope(draw, color):
    """Draw an envelope"""
    # Envelope body
    draw.rectangle([4, 8, 20, 18], fill=color)
    # Envelope flap
    draw.polygon([(4, 8), (12, 14), (20, 8)], fill=color)

def draw_rocket(draw, color):
    """Draw a rocket for deployment"""
    # Rocket body
    draw.polygon([(12, 2), (8, 22), (16, 22)], fill=color)
    # Fins
    draw.polygon([(6, 18), (8, 22), (10, 20)], fill=color)
    draw.polygon([(14, 20), (16, 22), (18, 18)], fill=color)

def draw_stop(draw, color):
    """Draw a stop/X icon"""
    draw.polygon([(4, 4), (8, 8), (12, 4), (16, 8), (20, 4), (20, 8), (16, 12), (20, 16), (20, 20), (16, 16), (12, 20), (8, 16), (4, 20), (4, 16), (8, 12), (4, 8)], fill=color)

def draw_assignment(draw, color):
    """Draw assignment/equals icon"""
    draw.rectangle([4, 8, 20, 10], fill=color)
    draw.rectangle([4, 14, 20, 16], fill=color)

def draw_broadcast(draw, color):
    """Draw broadcast/radio waves"""
    # Center point
    draw.ellipse([10, 10, 14, 14], fill=color)
    # Waves
    draw.arc([6, 6, 18, 18], 0, 360, fill=color, width=2)
    draw.arc([3, 3, 21, 21], 0, 360, fill=color, width=2)

def draw_diamond(draw, color):
    """Draw a diamond for decision"""
    draw.polygon([(12, 2), (22, 12), (12, 22), (2, 12)], fill=color)

def draw_play_result(draw, color):
    """Draw play with result arrow"""
    draw.polygon([(4, 6), (4, 18), (14, 12)], fill=color)
    draw.polygon([(16, 8), (16, 16), (22, 12)], fill=color)

def draw_error(draw, color):
    """Draw error/warning triangle"""
    draw.polygon([(12, 2), (22, 20), (2, 20)], fill=color)
    draw.ellipse([10, 16, 14, 20], fill=(255, 255, 255))

def draw_magnify(draw, color):
    """Draw magnifying glass"""
    draw.ellipse([4, 4, 16, 16], outline=color, width=2)
    draw.line([(14, 14), (20, 20)], fill=color, width=2)

def draw_repair(draw, color):
    """Draw repair/wrench icon"""
    draw.polygon([(4, 4), (8, 8), (16, 0), (20, 4), (12, 12), (20, 20), (16, 24), (8, 16), (0, 8)], fill=color)

def draw_network(draw, color):
    """Draw network topology"""
    # Nodes
    draw.ellipse([2, 2, 6, 6], fill=color)
    draw.ellipse([18, 2, 22, 6], fill=color)
    draw.ellipse([2, 18, 6, 22], fill=color)
    draw.ellipse([18, 18, 22, 22], fill=color)
    draw.ellipse([10, 10, 14, 14], fill=color)
    # Connections
    draw.line([(4, 4), (12, 12)], fill=color, width=2)
    draw.line([(20, 4), (12, 12)], fill=color, width=2)
    draw.line([(4, 20), (12, 12)], fill=color, width=2)
    draw.line([(20, 20), (12, 12)], fill=color, width=2)

def draw_trash(draw, color):
    """Draw trash can"""
    # Lid
    draw.rectangle([6, 6, 18, 8], fill=color)
    # Body
    draw.rectangle([8, 8, 16, 20], fill=color)
    # Handle
    draw.rectangle([10, 4, 14, 6], fill=color)

def draw_list(draw, color):
    """Draw list/query icon"""
    draw.rectangle([4, 4, 20, 6], fill=color)
    draw.rectangle([4, 10, 20, 12], fill=color)
    draw.rectangle([4, 16, 20, 18], fill=color)

def draw_edit(draw, color):
    """Draw edit/pencil icon"""
    draw.polygon([(2, 22), (8, 16), (20, 4), (22, 2), (24, 4), (12, 16), (4, 22)], fill=color)

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

if __name__ == '__main__':
    # Icon definitions with colors
    icons = {
        'camunda': ('#1a73e8', draw_gear),
        'process-instance': ('#34a853', draw_play),
        'task-worker': ('#ff9800', draw_worker),
        'complete-task': ('#ff9800', draw_check),
        'message': ('#9c27b0', draw_envelope),
        'start-message': ('#9c27b0', draw_envelope),
        'deploy': ('#607d8b', draw_rocket),
        'cancel-process-instance': ('#f44336', draw_stop),
        'set-variables': ('#34a853', draw_assignment),
        'broadcast-signal': ('#9c27b0', draw_broadcast),
        'evaluate-decision': ('#00bcd4', draw_diamond),
        'create-process-instance-with-result': ('#34a853', draw_play_result),
        'throw-error': ('#f44336', draw_error),
        'operate-query': ('#00bcd4', draw_magnify),
        'resolve-incident': ('#ff9800', draw_repair),
        'topology': ('#00bcd4', draw_network),
        'delete-resource': ('#f44336', draw_trash),
        'tasklist-query': ('#00bcd4', draw_list),
        'modify-process-instance': ('#795548', draw_edit),
    }
    
    for name, (color, draw_func) in icons.items():
        create_icon(name, hex_to_rgb(color), draw_func)