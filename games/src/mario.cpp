#include "raylib.h"
#include <iostream>
#include <string>

// Global vulnerable variables
int playerHealth = 100;
int playerCoins = 0;

// UI State
const char* ouchMsg = "Ouch! Lost 20 Health";
const char* coinMsg = "Ding! You got a coin!";
const char* currentMsg = "";
float messageTimer = 0.0f;

// The vulnerable assignment functions the Ghidra guide looks for
void encounterGoomba(float* playerX) {
    playerHealth = playerHealth - 20;
    currentMsg = ouchMsg;
    messageTimer = 2.0f;
    *playerX -= 50; // knockback
}

void encounterCoinBlock() {
    playerCoins = playerCoins + 1;
    currentMsg = coinMsg;
    messageTimer = 2.0f;
}

// Procedural Graphics Functions
void DrawMario(Rectangle p) {
    // Overalls and shirt
    DrawRectangle(p.x + 5, p.y + 15, 30, 25, BLUE);
    DrawRectangle(p.x + 10, p.y + 10, 20, 15, RED);
    // Shoes
    DrawRectangle(p.x, p.y + 35, 15, 10, BROWN);
    DrawRectangle(p.x + 25, p.y + 35, 15, 10, BROWN);
    // Face
    DrawCircle(p.x + 20, p.y + 10, 12, {255, 204, 153, 255}); // peach skin
    // Mustache & Eyes
    DrawRectangle(p.x + 22, p.y + 10, 10, 3, BLACK);
    DrawCircle(p.x + 24, p.y + 5, 2, BLACK);
    // Hat
    DrawCircleSector({p.x + 20, p.y + 2}, 14, 180, 360, 20, RED);
    DrawRectangle(p.x + 20, p.y, 15, 4, RED); // Hat brim
}

void DrawGoomba(Rectangle g) {
    // Body (stem)
    DrawRectangle(g.x + 5, g.y + 15, 20, 15, {255, 204, 153, 255});
    // Head (mushroom top)
    DrawCircleSector({g.x + 15, g.y + 15}, 16, 180, 360, 20, MAROON);
    // Eyes
    DrawRectangle(g.x + 8, g.y + 5, 3, 6, BLACK);
    DrawRectangle(g.x + 19, g.y + 5, 3, 6, BLACK);
    DrawRectangle(g.x + 9, g.y + 6, 1, 2, WHITE);
    DrawRectangle(g.x + 20, g.y + 6, 1, 2, WHITE);
    // Feet
    DrawCircleSector({g.x + 5, g.y + 30}, 8, 180, 360, 20, BLACK);
    DrawCircleSector({g.x + 25, g.y + 30}, 8, 180, 360, 20, BLACK);
}

void DrawCoin(Rectangle c) {
    DrawCircle(c.x + 10, c.y + 10, 10, ORANGE);
    DrawCircle(c.x + 10, c.y + 10, 8, GOLD);
    DrawRectangle(c.x + 8, c.y + 4, 4, 12, YELLOW);
}

int main() {
    const int screenWidth = 800;
    const int screenHeight = 450;
    InitWindow(screenWidth, screenHeight, "Super Visual Mario - RakHack Payload");
    SetTargetFPS(60);

    // Mario Physics
    Rectangle player = { 100, 300, 40, 40 };
    float velocityY = 0.0f;
    const float gravity = 0.5f;
    const float jumpForce = -10.0f;
    const float groundY = 350.0f;

    // Entities
    Rectangle goomba = { 500, groundY - 30, 30, 30 };
    Rectangle coin = { 600, 200, 20, 20 };
    
    bool goombaActive = true;
    bool coinActive = true;
    
    const char* overMsg = "GAME OVER!";
    const char* winMsg = "YOU WIN! 100 Coins collected!";

    while (!WindowShouldClose()) {
        // Physics update
        player.y += velocityY;
        
        if (player.y + player.height > groundY) {
            player.y = groundY - player.height;
            velocityY = 0;
            if (IsKeyDown(KEY_SPACE) || IsKeyDown(KEY_UP)) {
                velocityY = jumpForce;
            }
        } else {
            velocityY += gravity;
        }

        // Horizontal Movement
        if (IsKeyDown(KEY_RIGHT)) player.x += 4.0f;
        if (IsKeyDown(KEY_LEFT)) player.x -= 4.0f;
        
        // Goomba Logic
        if (goombaActive) {
            goomba.x -= 2.0f; // Walk left
            if (goomba.x < -30) goomba.x = 800;
            
            if (CheckCollisionRecs(player, goomba)) {
                // Determine if squashed or taking damage
                if (velocityY > 0 && player.y + player.height < goomba.y + 15) {
                    goombaActive = false; // Squashed
                    velocityY = -8.0f; // Bounce
                } else {
                    // Call the vulnerable payload function!
                    encounterGoomba(&player.x);
                }
            }
        } else {
            // Respawn Goomba
            if (GetRandomValue(0, 100) < 1) {
                goombaActive = true;
                goomba.x = 850;
            }
        }

        // Coin Logic
        if (coinActive) {
            coin.x -= 2.0f; // Scroll left like the environment
            if (coin.x < -30) {
                coinActive = false; // Despawn when off-screen to let it randomly respawn
            }
            
            if (CheckCollisionRecs(player, coin)) {
                // Call the vulnerable payload function!
                encounterCoinBlock();
                coinActive = false;
            }
        } else {
            // Respawn Coin
            if (GetRandomValue(0, 100) < 1) {
                coinActive = true;
                coin.x = 850; // Spawn off screen right
                coin.y = GetRandomValue(150, 250); // Randomize vertical height
            }
        }

        // Timers
        if (messageTimer > 0) messageTimer -= GetFrameTime();

        // Screen wrap
        if (player.x > screenWidth) player.x = -player.width;
        if (player.x < -player.width) player.x = screenWidth;

        // Draw
        BeginDrawing();
            ClearBackground(SKYBLUE);
            
            // Floor
            DrawRectangle(0, groundY, screenWidth, screenHeight - groundY, GREEN);
            DrawRectangle(0, groundY, screenWidth, 10, DARKGREEN); // Grass top

            if (playerHealth > 0 && playerCoins < 100) {
                // Procedural Entities
                DrawMario(player);
                if (goombaActive) DrawGoomba(goomba);
                if (coinActive) DrawCoin(coin);

                // UI
                DrawText(TextFormat("Health: %03i", playerHealth), 10, 10, 20, RAYWHITE);
                DrawText(TextFormat("Coins: %03i / 100", playerCoins), 10, 40, 20, GOLD);

                if (messageTimer > 0) {
                    DrawText(currentMsg, player.x, player.y - 30, 20, BLACK);
                }
            } else if (playerHealth <= 0) {
                DrawText(overMsg, screenWidth/2 - 100, screenHeight/2 - 20, 40, RED);
            } else if (playerCoins >= 100) {
                DrawText(winMsg, screenWidth/2 - 200, screenHeight/2 - 20, 30, YELLOW);
            }

        EndDrawing();
    }

    CloseWindow();
    return 0;
}
