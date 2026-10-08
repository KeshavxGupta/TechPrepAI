# TechPrep AI — REST API & Compiler Specifications

## Overview
This document specifies the core REST endpoints for TechPrep AI, including authentication, quizzes, DSA code workspace, proctoring telemetry, and resume ATS scanner.

---

## 1. DSA Code Execution (`/api/dsa`)

### `POST /api/dsa/run`
Executes student source code against predefined or dynamic test cases on host compilers.

**Request Body:**
```json
{
  "problemId": "two-sum",
  "language": "javascript" | "python" | "cpp" | "java",
  "code": "function twoSum(nums, target) { ... }",
  "customInput": "[2,7,11,15]\n9", // Optional
  "testCases": [ // Optional dynamic test cases
    { "input": "[2,7,11,15]\n9", "expectedOutput": "[0,1]" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "status": "Accepted" | "Wrong Answer" | "Compile Error" | "Runtime Error",
    "compiler": "Python 3.12",
    "runtime": "120 ms",
    "memory": "40.2 MB",
    "passedCases": 3,
    "totalCases": 3,
    "testResults": [
      {
        "testCaseIndex": 1,
        "status": "Passed",
        "runtimeMs": 42,
        "input": "...",
        "expectedOutput": "...",
        "actualOutput": "..."
      }
    ]
  }
}
```

---

## 2. Quizzes & Assessments (`/api/quizzes`)

### `GET /api/quizzes`
Retrieves all active quizzes including MCQs and Coding Challenges.

### `POST /api/quizzes`
Creates a new quiz (Admin only). Supports `questionType: "coding"` with boilerplate code, language, and automated test cases.

### `POST /api/quizzes/results`
Submits student quiz attempt with itemized answers, security violations telemetry, and final score.
