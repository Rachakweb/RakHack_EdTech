# Tool Infrastructure Setup: Ghidra & JDK

Welcome to Module 00 of the RakHack Reverse Engineering Assessment.
Before you can analyze the vulnerable binaries, you must set up your environment with the correct NSA-developed Software Reverse Engineering (SRE) tools.

## Phase 1: Java Development Kit (JDK)
Ghidra is written in Java and requires a modern Java Development Kit (JDK) 21+ to run properly.

### Official Download Link
- Go to the Official Eclipse Temurin JDK download page: [adoptium.net/temurin/releases/](https://adoptium.net/temurin/releases/)
- Select your OS (Windows/Linux/macOS) and Architecture (x64/aarch64).
- Download the `.msi` (Windows) or `.pkg` (macOS) installer.

### Verification
Once installed, open a secure terminal command prompt and inject the following validation command:
```bash
java -version
```
If the system responds with a JDK version 21 or higher, proceed to Phase 2.

## Phase 2: Ghidra Open Source Framework

### Official Download Link
- Navigate to the official NSA repository: [github.com/NationalSecurityAgency/ghidra/releases](https://github.com/NationalSecurityAgency/ghidra/releases)
- Download the latest `.zip` release artifact (e.g., `ghidra_XY.Z_PUBLIC_YYYYMMDD.zip`).

### Deployment
1. Extract the downloaded `.zip` file into a dedicated tool directory (e.g., `C:\Tools\Ghidra`).
2. **Execute**: 
   - On Windows, double-click `ghidraRun.bat`.
   - On Linux/macOS, execute `./ghidraRun` from the terminal.

### First Boot Protocol
When Ghidra initializes for the first time, you will see a dragon splash screen. Wait for the active modules to load. Once the main "Project Window" appears, your environment is successfully compromised and ready for payload analysis! You may now move to the next course module.
