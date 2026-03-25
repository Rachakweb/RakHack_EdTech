#include "raylib.h"
#include <vector>

const int TILE_SIZE = 20;
const int GRID_W = 40;
const int GRID_H = 22;

struct SnakeSegment {
    int x;
    int y;
};

// Global score target
int currentScore = 0;

int main() {
    InitWindow(GRID_W * TILE_SIZE, GRID_H * TILE_SIZE, "Visual Snake Target Payload - RakHack");
    SetTargetFPS(8); // Slow FPS for classic snake feel

    std::vector<SnakeSegment> snake;
    snake.push_back({ GRID_W / 2, GRID_H / 2 });
    
    int foodX = GetRandomValue(0, GRID_W - 1);
    int foodY = GetRandomValue(0, GRID_H - 1);
    
    int dirX = 1;
    int dirY = 0;
    bool gameOver = false;
    
    const char* winMessage = "WOW! YOU REACHED SCORE 50!";

    while (!WindowShouldClose()) {
        if (!gameOver && currentScore < 50) {
            // Input
            if (IsKeyPressed(KEY_UP) && dirY == 0) { dirX = 0; dirY = -1; }
            if (IsKeyPressed(KEY_DOWN) && dirY == 0) { dirX = 0; dirY = 1; }
            if (IsKeyPressed(KEY_LEFT) && dirX == 0) { dirX = -1; dirY = 0; }
            if (IsKeyPressed(KEY_RIGHT) && dirX == 0) { dirX = 1; dirY = 0; }

            // Move body
            for (size_t i = snake.size() - 1; i > 0; i--) {
                snake[i] = snake[i - 1];
            }
            snake[0].x += dirX;
            snake[0].y += dirY;

            // Collision with walls
            if (snake[0].x < 0 || snake[0].x >= GRID_W || snake[0].y < 0 || snake[0].y >= GRID_H) {
                gameOver = true;
            }

            // Collision with self
            for (size_t i = 1; i < snake.size(); i++) {
                if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                    gameOver = true;
                }
            }

            // Collision with food
            if (snake[0].x == foodX && snake[0].y == foodY) {
                // VULNERABLE LOGIC: Incrementing by 1
                currentScore = currentScore + 1;
                
                // Grow
                snake.push_back({ snake.back().x, snake.back().y });
                
                // New Food
                foodX = GetRandomValue(0, GRID_W - 1);
                foodY = GetRandomValue(0, GRID_H - 1);
            }
        }

        // Draw
        BeginDrawing();
            ClearBackground(BLACK);
            
            // Grid
            for (int i = 0; i < GRID_W; i++) {
                DrawLine(i*TILE_SIZE, 0, i*TILE_SIZE, GRID_H*TILE_SIZE, Color{30, 30, 30, 255});
            }
            for (int i = 0; i < GRID_H; i++) {
                DrawLine(0, i*TILE_SIZE, GRID_W*TILE_SIZE, i*TILE_SIZE, Color{30, 30, 30, 255});
            }

            if (!gameOver && currentScore < 50) {
                // Food
                DrawRectangle(foodX * TILE_SIZE, foodY * TILE_SIZE, TILE_SIZE, TILE_SIZE, RED);

                // Snake
                for (size_t i = 0; i < snake.size(); i++) {
                    DrawRectangle(snake[i].x * TILE_SIZE, snake[i].y * TILE_SIZE, TILE_SIZE, TILE_SIZE, LIME);
                }
                
                DrawText(TextFormat("Score: %i / 50", currentScore), 10, 10, 20, WHITE);
            } else if (gameOver) {
                DrawText("GAME OVER!", 320, 200, 40, RED);
            } else if (currentScore >= 50) {
                DrawText(winMessage, 150, 200, 30, GOLD);
            }

        EndDrawing();
    }

    CloseWindow();
    return 0;
}
