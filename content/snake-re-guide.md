# Reverse Engineering Snake (C++)

This assessment continues your reverse engineering education using **Ghidra**. You will analyze a classic text-based Snake game and learn how to alter game state logic and score calculations by patching the compiled executable.

## Prerequisites
Before starting, ensure you have:
- Completed the `mario.exe` assessment or have equivalent introductory experience with Ghidra.
- Basic familiarity with C/C++ game loops (`while (!gameOver)`).
- Understanding of memory addresses and pointers in x86 Assembly.

## Tool Documentation: Ghidra Features
In this guide, we'll introduce you to some advanced features in Ghidra:
- **Defined Strings Tab**: Accessible via `Window -> Defined Strings`. A faster way to filter all strings found in the binary.
- **Function Graph**: Provides a visual flowchart of a function's execution paths, useful for understanding complex `if/else` logic.
- **Decompiler Type Overrides**: Allows you to rename variables in the decompiled code (Right-click a generic variable like `iVar1` -> **Rename Variable**) to make the code readable.

## Your Goal
In `snake.exe` (a visual 2D grid game), you need 50 points to win, and each "fruit" gives you 1 point.
**Task 1:** Modify the binary so that each fruit grants you 50 points, resulting in an instant win on your first fruit.
**Task 2 (Optional Hero Challenge):** Identify the code block running the 2D spatial collision for self-intersection, and disable it so you can never die.

---

## Step-by-Step Guide

### Step 1: Initial Analysis
1. Import `snake.exe` into Ghidra, open it in the CodeBrowser, and allow the auto-analysis to complete.
2. Open the **Defined Strings** window (`Window -> Defined Strings`) and look for "Score:" or "WOW! YOU REACHED SCORE 50!".
3. Follow the `XREF` from the winning string to find the main game loop or the logic evaluation function.

### Step 2: Decompiling the Logic
1. Looking at the decompiled code for the main function, you might see game variables like `DAT_0040...` (which are global variables).
2. Right click on the global variable that represents the score (you can identify it because it's being compared to `0x32`, which is 50 in decimal). Rename it to `score` for clarity.
3. Next, find the function Responsible for adding to the score. You can do this by highlighting the `score` variable and right-clicking -> `References -> Find References to score`. Look for a reference where it's being assigned or added.

### Step 3: Patching the Score Increment
1. Jump to the function where `score = score + 1;` happens (this corresponds to eating the fruit).
2. In the assembly Listing, locate the instruction responsible for the increment, likely an `ADD` or `INC`.
3. Right-click the instruction -> **Patch Instruction**.
4. Change the operand. Instead of adding `1`, change the assembly to `ADD [address], 0x32`.

### Step 4: Finalizing and Testing
1. Export the binary.
2. Run your patched `snake.exe`.
3. Collect one piece of fruit (F) and verify that your score jumps immediately to 50, triggering the Win condition!
