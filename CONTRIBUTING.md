# Contributing to TechPrep AI

Thank you for contributing to TechPrep AI!

## Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/KeshavxGupta/TechPrepAI.git
   cd TechPrepAI
   ```

2. **Install Root and Backend Dependencies**:
   ```bash
   npm install
   npm run install:all
   ```

3. **Configure Environment Variables**:
   Copy `backend/.env.example` to `backend/.env` and set your MongoDB Atlas connection string.

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Run the Test Suite**:
   ```bash
   node backend/tests/compiler.test.js
   ```
