import pygame
import random

# Set up Pygame graphics display
pygame.init()
win = pygame.display.set_mode((800, 640))
font = pygame.font.Font(None, 32)

# Define colors and width/height of snake body segments
body_color = (51, 51, 51)
segment_width = int(8 * (pygame.ratio))
segment_height = segment_width

# Start snake position
start_x = win.get_rect().center[0] - 9 * segment_width / 2
start_y = 320
snake = [{"position": {"x": start_x, "y": start_y}, "speed": 1}]

# Function to update snake direction based on user input
def move_snake():
    global snake
    keys = pygame.key.get_pressed()
    if keys[pygame.K_UP]:
        new_direction = ["right", "up"]
    elif keys[pygame.K_DOWN]:
        new_direction = ["down", "down"]
    elif keys[pygame.K_LEFT]:
        new_direction = ["left", "left"]
    else:
        new_direction = ["forward", "forward"]
    
    # Check if the new direction would cause collision with self
    while len(new_direction):
        next_move = new_direction.pop(0).lower() + "."
        
        if next_move == "left" or next_move == "right":
            x += 1
            
        elif next_move == "down" or next_move == "up":
            y += 1
            
        x %= 800
        y %= 640
        
    snake.append({"position": {f"{x}{segment_width},{y*segment_height}},"speed": 1})
    time.sleep(.1)

while True:
    # Clear screen before drawing each frame
    win.fill(pygame.Color("lightgray"))
    draw_grid(win)
    blinker(win, pygame.Rect([start_x*segment_width,(y)*segment_height],[segment_width,segment_height]))
    blinker(win, pygame.Rect([start_x+(x+1)*segment_width, (y)*segment_height],[segment_width,segment_height]))
    blinker(win, pygame.Rect([start_x+2*(x+1)*segment_width , (y+1)*segment_height],[segment_width,segment_height]))
    # Update snake movement based on keypresses from user
    move_snake()
    # Update food position randomly on every iteration except first one
    if not snake[0]['position']['x'] == 400:
        add_food()
    pygame.display.update()