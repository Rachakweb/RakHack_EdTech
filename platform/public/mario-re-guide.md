# Comprehensive Guide: Reverse Engineering Mario (C++)

Welcome to the **Reverse Engineering: Ghidra Basics** module! This guide will teach you, step-by-step, how to reverse engineer and manipulate a compiled C++ game using **Ghidra**, a powerful open-source reverse engineering tool originally developed by the NSA.

By the end of this module, you will understand how source code corresponds to assembly language, how to navigate memory, and how to patch binary instructions to bend the game's rules to your will!

---

## 🧠 Core Concepts: What is Reverse Engineering?
When a developer writes a game in C++, the compiler translates that human-readable code into **machine code** (1s and 0s) that the CPU can execute. Reverse Engineering is the process of taking that compiled binary (`.exe`) and translating it *backward* into **Assembly Language** and pseudo-C code to understand how it works.

### Essential Knowledge
Before diving into Ghidra, you must understand a few core concepts:

#### 1. Hexadecimal (Base-16)
Computers use Hexadecimal (Hex) to represent memory addresses and values compactly. Hex uses numbers `0-9` and letters `A-F`.
*   `0x0A` = 10 in Decimal
*   `0x14` = 20 in Decimal
*   `0x64` = 100 in Decimal

#### 2. Registers and Pointers
*   **Registers**: Tiny, extremely fast storage areas directly on the CPU (e.g., `EAX`, `EBX`, `RCX`).
*   **Pointers**: Variables that store the memory address of another value. In assembly, you will often see brackets like `[DAT_00405020]`, which means "the value stored at this exact memory address."

#### 3. Basic x86 Assembly Instructions
You don't need to know how to write assembly from scratch, but you must be able to read it:
*   `MOV EAX, 0x5` - Move the value `5` into the `EAX` register.
*   `ADD [Health], 0x1` - Add `1` to the memory address storing the Health variable.
*   `SUB [Health], 0x14` - Subtract `20` (0x14) from Health.
*   `CMP EAX, 0x64` - Compare the `EAX` register to `100` (often followed by a jump instruction).

---

## 🎯 Your Assessment Goals
The `mario.exe` payload you downloaded is a fully functional 2D game providing you with 100 Health and 0 Coins initially.  
**Task 1:** Modify the binary so that taking damage from the Goomba enemy **increases** your health instead of hurting you.  
**Task 2:** Modify the binary so that collecting a single golden coin gives you **100** coins instantly, triggering the Win Condition.

---

## 🛠️ Step-by-Step Ghidra Walkthrough

### Step 1: Importing and Analyzing the Binary
Ghidra needs to disassemble the binary to show you the underlying code.
1. Open Ghidra and create a new project (`File -> New Project -> Non-Shared`). Name it "RakHack_Mario".
2. Go to `File -> Import File` and select your downloaded `mario.exe` payload.
3. Double-click on `mario.exe` in the Active Project window to open the **CodeBrowser** (the green dragon icon).
4. Ghidra will immediately prompt you to analyze the file. Click **Yes** and leave all default options checked. Wait for the green progress bar in the bottom right corner to finish.

> [!TIP]
> Analysis can take a minute. Ghidra is automatically mapping out every function, memory reference, and literal string embedded in the executable!

### Step 2: The Art of String Searching
Compiled games consist of thousands of unnamed functions. How do you find the exact logic you want to hack? **Strings!** Any text printed to the screen is hardcoded into the binary's read-only memory sections and represents the easiest anchor point for hackers.

1. In the CodeBrowser top menu, go to `Search -> For Strings`. Hit **Search**.
2. A new window will pop up enumerating every piece of text in the game. Filter the list by typing `Ouch` in the bottom filter box.
3. You will see the literal string `"Ouch! Lost 20 Health"`. Double-click it.
4. The main Listing window will jump to that string's location in memory. 
5. Look to the far right of the string for an `XREF` (Cross Reference) tag. This tells you *which function* uses this text. Double-click the `XREF: encounterGoomba` link to jump directly to the vulnerability.

### Step 3: Patching the Health Logic (Task 1)
You are now inside the `encounterGoomba()` function. 

1. Look at the **Decompiler** window (usually on the right side). Ghidra attempts to translate the assembly back into highly readable C code. You should see something like:
   ```c
   void encounterGoomba(float *param_1)
   {
       DAT_004b9014 = DAT_004b9014 + -0x14; // Subtracts 20 (0x14)
       DAT_004b901c = "Ouch! Lost 20 Health";
       // ...
   }
   ```
   > [!NOTE]
   > `DAT_004b9014` is simply Ghidra's temporary assigned name for the global `playerHealth` integer!

2. Click on the `DAT_004b9014 = DAT_004b9014 + -0x14;` line in the Decompiler. Ghidra will automatically highlight the corresponding physical Assembly instruction in the middle window.
3. Look at the assembly memory representation. It will look similar to:
   `SUB dword ptr [DAT_004b9014], 0x14` or `ADD dword ptr [DAT_004b9014], -0x14`.
4. **The Exploit:** We want to gain health upon taking damage! Right-click that exact Assembly instruction in the middle window and select **Patch Instruction**.
5. Change the mnemonic from `SUB` to `ADD` (or if it's an `ADD` with `-0x14`, change it to a positive `0x14`). Hit Enter.
6. Look back at your Decompiler window; it should instantly update to show `DAT_004b9014 = DAT_004b9014 + 0x14`! You have successfully manipulated the binary.

### Step 4: Patching the Coin Logic (Task 2)
Now let's rig the game so a single coin grants us the win condition!

1. Repeat the string search (`Search -> For Strings`), but this time filter for `"Ding! You got a coin!"`.
2. Follow the `XREF` to jump into the `encounterCoinBlock()` memory address.
3. In the Decompiler, locate the line responsible for adding coins to your wallet:
   ```c
   DAT_004b9018 = DAT_004b9018 + 0x1;
   ```
4. Click that line to highlight the Assembly equivalent (`ADD dword ptr [DAT_004b9018], 0x1`).
5. Right-click the instruction -> **Patch Instruction**.
6. Change the `0x1` operand multiplier to `0x64` (which is the Hexadecimal translation of 100). Hit Enter.
7. The Decompiler will immediately update to show `DAT_004b9018 + 0x64`.

### Step 5: Exporting the Hacked Binary
You've completely rewritten the game's execution flow in memory. Now we must save it to disk.

1. Go to `File -> Export Program`.
2. Change the Format to **Original File**.
3. Name your file `hacked_mario.exe` and hit OK.
4. Close Ghidra and double-click your newly minted `hacked_mario.exe`! Walk into the Goomba to verify your health skyrockets indefinitely, and grab a coin to instantly hit 100 coins and trigger the **YOU WIN!** condition!

> **Assessment Complete:** Give yourself a pat on the back. Return to the core RakHack EdTech platform and enter your insights to securely complete **MOD 01**!
