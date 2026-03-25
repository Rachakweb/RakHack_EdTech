# Reverse Engineering Mario (C++)

This guide will teach you how to reverse engineer a compiled C++ game using **Ghidra**, a powerful open-source reverse engineering tool developed by the NSA.

## Prerequisites
Before starting this assessment, you should have foundational knowledge in:
- **C/C++ Programming**: Understanding of variables, conditional statements (`if`/`else`), and basic syntax.
- **x86/x64 Assembly**: Basic familiarity with registers (`EAX`, `EBX`), instructions (`MOV`, `SUB`, `ADD`, `CMP`, `JMP`), and program flow.
- **Hexadecimal**: Understanding of hex numbers (e.g., `0x64` = 100).

## Tool Documentation: Ghidra
**Ghidra** is a software reverse engineering (SRE) framework created and maintained by the National Security Agency Research Directorate. 
You can download it for free from [ghidra-sre.org](https://ghidra-sre.org/).
- **CodeBrowser**: The main tool where you will view the assembly and decompiled C code.
- **Decompiler**: Ghidra automatically translates assembly back into a representation of C code, making it incredibly helpful for beginners.
- **Search Strings**: A fundamental feature used to find text compiled into the binary (e.g., "Health:", "Game Over").

## Your Goal
The `mario.exe` game is a fully 2D graphical game providing you with 100 Health and 0 Coins initially.  
**Task 1:** Modify the binary so that taking damage from the brown Goomba rectangles **increases** your health instead of decreasing it.  
**Task 2:** Modify the binary so that colliding with a yellow Coin gives you **100** coins instead of 1.

---

## Step-by-Step Guide

### Step 1: Import the Game
1. Open Ghidra and create a new project (`File -> New Project -> Non-Shared`).
2. Press `I` or go to `File -> Import File` and select `mario.exe`.
3. Double click on `mario.exe` in the Active Project window to open the **CodeBrowser**.
4. When prompted to analyze, click **Yes** and use the default settings.

### Step 2: Locate the Target Logic
A common tactic in reverse engineering is to find strings that indicate where the logic happens.
1. In the CodeBrowser, go to `Search -> For Strings`.
2. Search for the text "Ouch!" or "Ding! You got a coin".
3. Double-click the result to jump to the string's location in memory.
4. In the main listing window, look for an `XREF` (Cross Reference) to the right of the string. Double-click the function reference to jump to the code that uses this string.

### Step 3: Patching the Health Logic 
1. Once you are in the `encounterGoomba()` function, look at the Decompiler window (usually on the right).
2. You will see code that looks like: `playerHealth = playerHealth + -0x14;` (Note: 0x14 is 20 in decimal).
3. If you click on that line in the Decompiler, Ghidra will highlight the corresponding assembly instruction in the Listing window. Look for a `SUB` instruction or an `ADD` instruction with a negative operand.
4. **The Patch:** Right-click the Assembly instruction in the Listing window -> Select **Patch Instruction**.
5. Change the instruction to `ADD` (if it was `SUB`) or change the operand from `-0x14` to positive `0x14`.

### Step 4: Patching the Coin Logic
1. Repeat the string search for "Ding!". Jump to the `encounterCoinBlock()` function.
2. In the Decompiler, you will see `playerCoins = playerCoins + 1;`.
3. Find the assembly instruction. It will likely look like `ADD [memory_address], 0x1`.
4. Right-click -> **Patch Instruction**.
5. Change `0x1` to `0x64` (which is 100 in decimal).

### Step 5: Exporting the Patched Game
1. Save your progress in Ghidra (`Ctrl + S`).
2. To export the patched binary, you can use Ghidra's basic export feature, though third-party scripts like `SavePatch` are often better.
3. Once exported, run your modified `mario.exe`. If you encounter a Goomba and survive to collect a coin, you should instantly win the game!
