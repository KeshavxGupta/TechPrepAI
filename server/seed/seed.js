require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Placement = require('../models/Placement');
const DsaProblem = require('../models/DsaProblem');

const SEED_QUIZZES = [
  {
    customId: 'quiz_js_fundamentals',
    title: 'JavaScript & Async Web Programming',
    description: 'Master advanced closures, hoisting, scope chain, event loop, Promises, and prototype mechanics.',
    timeLimit: 5,
    passPercentage: 70,
    category: 'Web Development',
    questions: [
      {
        text: 'Which of the following is true about closure in JavaScript?',
        options: [
          "It allows an outer function to access the inner function's variables.",
          "It is a feature that binds a function together with its lexical environment.",
          "It prevents memory garbage collection permanently.",
          "It can only be used with Arrow functions."
        ],
        correctIndex: 1,
        explanation: 'A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).'
      },
      {
        text: 'What does this code output: console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4); ?',
        options: [
          '1, 2, 3, 4',
          '1, 4, 2, 3',
          '1, 4, 3, 2',
          '1, 3, 4, 2'
        ],
        correctIndex: 2,
        explanation: 'Synchronous code runs first (1, 4). Promises go to the Microtask Queue and run next (3). setTimeout goes to the Macrotask Queue and runs last (2).'
      },
      {
        text: 'Which keyword is block-scoped in ES6?',
        options: ['var', 'let', 'function', 'global'],
        correctIndex: 1,
        explanation: 'Variables declared with let and const are block-scoped, whereas var is function-scoped.'
      }
    ]
  },
  {
    customId: 'quiz_dsa_core',
    title: 'DSA: Trees, Graphs & Complexity',
    description: 'Evaluate your understanding of tree traversals, shortest path algorithms, and computational complexity bounds.',
    timeLimit: 10,
    passPercentage: 60,
    category: 'Algorithms',
    questions: [
      {
        text: 'What is the worst-case space complexity of Depth First Search (DFS) traversal on a graph?',
        options: [
          'O(1)',
          'O(V) where V is the number of vertices (due to call stack)',
          'O(E) where E is the number of edges',
          'O(V * E)'
        ],
        correctIndex: 1,
        explanation: 'In the worst case (a linear graph/tree), the recursive call stack for DFS can grow up to the number of vertices, leading to O(V) space complexity.'
      },
      {
        text: 'Which algorithm finds the shortest path in a weighted graph with negative edge weights but no negative cycles?',
        options: [
          "Dijkstra's Algorithm",
          "Kruskal's Algorithm",
          'Bellman-Ford Algorithm',
          "Prim's Algorithm"
        ],
        correctIndex: 2,
        explanation: 'Bellman-Ford algorithm is specifically designed to handle negative edge weights, whereas Dijkstra\'s algorithm might fail.'
      }
    ]
  },
  {
    customId: 'quiz_dbms_core',
    title: 'DBMS & Transactional Integrity',
    description: 'A core test on database normal forms, ACID properties, indexing optimization, and SQL aggregates.',
    timeLimit: 6,
    passPercentage: 65,
    category: 'Database Systems',
    questions: [
      {
        text: 'Which normal form requires the removal of transitive dependencies?',
        options: [
          'First Normal Form (1NF)',
          'Second Normal Form (2NF)',
          'Third Normal Form (3NF)',
          'Boyce-Codd Normal Form (BCNF)'
        ],
        correctIndex: 2,
        explanation: 'Third Normal Form (3NF) requires that there are no transitive functional dependencies of non-prime attributes on superkeys.'
      },
      {
        text: 'What does the \'I\' in ACID properties of transaction management guarantee?',
        options: ['Integrity', 'Consistency', 'Isolation', 'Idempotency'],
        correctIndex: 2,
        explanation: 'Isolation ensures that concurrent execution of transactions leaves the database in the same state as if transactions were executed sequentially.'
      },
      {
        text: 'Which index structure is primarily used by relational database engines (like MySQL InnoDB) for sorting and range queries?',
        options: ['Hash Indexes', 'B+ Trees', 'Binary Search Trees', 'Red-Black Trees'],
        correctIndex: 1,
        explanation: 'B+ Trees keep data sorted, allowing efficient search, sequential access, and range selections (O(log n)).'
      }
    ]
  }
];

const SEED_DRIVES = [
  {
    customId: 'drive-1',
    company: 'Google',
    role: 'Software Development Engineer (SWE-1)',
    package: '32.0',
    deadline: '2026-09-30',
    interviewDate: '2026-10-15',
    eligibility: 'B.Tech/M.Tech CS/IT with 8.0+ CGPA',
    location: 'Bengaluru / Hyderabad (Hybrid)',
    status: 'wishlist',
    link: 'https://careers.google.com',
    notes: 'Focus on Graph algorithms, Dynamic Programming, and System Design fundamentals.',
    studentEmail: null
  },
  {
    customId: 'drive-2',
    company: 'Microsoft',
    role: 'Software Engineer - Cloud & AI',
    package: '28.5',
    deadline: '2026-09-25',
    interviewDate: '2026-10-10',
    eligibility: '7.5+ CGPA, All Engineering Branches',
    location: 'Noida / Hyderabad / Remote',
    status: 'wishlist',
    link: 'https://careers.microsoft.com',
    notes: 'Round 1: Codility OA (3 DSA Questions), Round 2: Architecture & Systems.',
    studentEmail: null
  },
  {
    customId: 'drive-3',
    company: 'Amazon',
    role: 'SDE-1 (AWS Services)',
    package: '26.0',
    deadline: '2026-10-05',
    interviewDate: '2026-10-20',
    eligibility: '7.0+ CGPA, 2026 Batch',
    location: 'Bengaluru / Chennai',
    status: 'wishlist',
    link: 'https://amazon.jobs',
    notes: 'Amazon Leadership Principles + 2 DSA Technical Interview rounds.',
    studentEmail: null
  },
  {
    customId: 'drive-4',
    company: 'Atlassian',
    role: 'Software Engineer (Full Stack / Java)',
    package: '38.0',
    deadline: '2026-10-12',
    interviewDate: '2026-10-28',
    eligibility: '8.0+ CGPA, CS/IT/ECE',
    location: 'Bengaluru (Remote Friendly)',
    status: 'wishlist',
    link: 'https://www.atlassian.com/company/careers',
    notes: 'Craftsmanship & Values interview + Code design round.',
    studentEmail: null
  },
  {
    customId: 'drive-5',
    company: 'Goldman Sachs',
    role: 'Summer Analyst / Tech Analyst',
    package: '24.0',
    deadline: '2026-09-18',
    interviewDate: '2026-09-28',
    eligibility: '7.5+ CGPA, Strong Math & Coding',
    location: 'Bengaluru / Mumbai',
    status: 'wishlist',
    link: 'https://www.goldmansachs.com/careers',
    notes: 'Aptitude + Advanced Data Structures + Core CS (OS/DBMS/CN).',
    studentEmail: null
  }
];

const SEED_DSA_PROBLEMS = [
  {
    problemId: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hash Maps',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for(int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if(mp.find(comp) != mp.end()) return {mp[comp], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for(int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if(map.containsKey(complement)) return new int[] { map.get(complement), i };\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}'
    }
  },
  {
    problemId: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Every bracket is matched and closed properly.'
      }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only ()[]{}'],
    starterCode: {
      javascript: 'function isValid(s) {\n  const stack = [];\n  const map = { ")": "(", "}": "{", "]": "[" };\n  for (let char of s) {\n    if (char in map) {\n      if (stack.pop() !== map[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}'
    }
  }
];

async function seedDatabase() {
  console.log('[Seed] Initializing database seeding...');
  await connectDB();

  // 1. Seed Admin User
  const adminEmail = 'khushboo2006june@admin.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Khushboo (Admin)',
      email: adminEmail,
      password: 'khushboo',
      role: 'admin',
      college: 'Admin Suite',
      branch: 'Operations',
      cgpa: '10.0'
    });
    console.log('[Seed] Admin account created: khushboo2006june@admin.com');
  } else {
    console.log('[Seed] Admin account already exists.');
  }

  // 2. Seed Demo Student
  const demoEmail = 'student@techprepai.com';
  let student = await User.findOne({ email: demoEmail });
  if (!student) {
    student = await User.create({
      name: 'Aman Sharma',
      email: demoEmail,
      password: 'password123',
      role: 'student',
      college: 'National Institute of Technology',
      degree: 'B.Tech',
      branch: 'Computer Science',
      specialization: 'Artificial Intelligence',
      gradYear: '2026',
      cgpa: '9.2',
      skills: 'JavaScript, Node.js, React, C++, Data Structures',
      github: 'https://github.com/amansharma',
      linkedin: 'https://linkedin.com/in/amansharma'
    });
    console.log('[Seed] Demo student account created: student@techprepai.com');
  }

  // 3. Seed Quizzes
  for (const q of SEED_QUIZZES) {
    const exists = await Quiz.findOne({ customId: q.customId });
    if (!exists) {
      await Quiz.create(q);
      console.log(`[Seed] Quiz added: ${q.title}`);
    }
  }

  // 4. Seed Placement Drives
  for (const drive of SEED_DRIVES) {
    const exists = await Placement.findOne({ customId: drive.customId });
    if (!exists) {
      await Placement.create(drive);
      console.log(`[Seed] Placement Drive added: ${drive.company} - ${drive.role}`);
    }
  }

  // 5. Seed DSA Problems
  for (const prob of SEED_DSA_PROBLEMS) {
    const exists = await DsaProblem.findOne({ problemId: prob.problemId });
    if (!exists) {
      await DsaProblem.create(prob);
      console.log(`[Seed] DSA Problem added: ${prob.title}`);
    }
  }

  console.log('[Seed] Database seeding completed successfully!');
  await mongoose.connection.close();
  process.exit(0);
}

seedDatabase().catch(err => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
