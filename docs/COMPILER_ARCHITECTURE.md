# TechPrep AI — Multi-Language Compiler Architecture

```mermaid
flowchart TD
    Client["Client / User Code Workspace"] -->|POST /api/dsa/run| Controller["DSA Controller"]
    Controller --> Validator["Payload Validator & Security Heuristic"]
    Validator --> Queue["Execution Queue (Worker Pool)"]
    Queue --> CompilerService["Compiler Service"]

    subgraph Runtimes["Host Toolchains"]
        CompilerService -->|Node v22.6| JS["Node.js Engine"]
        CompilerService -->|Python 3.12| PY["Python Engine"]
        CompilerService -->|GCC 14.2| CPP["G++ 20 Binary"]
        CompilerService -->|OpenJDK 21| JAVA["Adoptium Java VM"]
    end

    Runtimes --> Harness["Driver Invocator & Stdin Stream"]
    Harness --> Comparator["LeetCode Output Comparator"]
    Comparator --> Response["JSON Status, Runtime, Memory"]
```

## Safety Measures
1. **Process Timeouts**: Each child process is terminated with `SIGKILL` / `taskkill /F /T` after 6000 ms.
2. **Memory Ceiling**: 512 MB OS limit enforced per process.
3. **Workspace Isolation**: Each run executes in isolated random subfolders within `temp/executions/`.
