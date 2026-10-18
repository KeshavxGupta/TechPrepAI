/**
 * TechPrep AI - Quiz Core Engine
 * Connects to MERN Backend /api/quizzes with resilient local caching and history.
 */

const QUIZZES_KEY = 'techprep_quizzes';
const RESULTS_KEY = 'techprep_user_quiz_results';

const SEED_QUIZZES = [
  {
    id: 'quiz_js_fundamentals',
    customId: 'quiz_js_fundamentals',
    title: 'JavaScript & Async Web Programming',
    description: 'Master advanced closures, hoisting, scope chain, event loop, Promises, and prototype mechanics.',
    timeLimit: 5,
    passPercentage: 70,
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
    id: 'quiz_dsa_core',
    customId: 'quiz_dsa_core',
    title: 'DSA: Trees, Graphs & Complexity',
    description: 'Evaluate your understanding of tree traversals, shortest path algorithms, and computational complexity bounds.',
    timeLimit: 10,
    passPercentage: 60,
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
        explanation: 'Bellman-Ford algorithm is specifically designed to handle negative edge weights, whereas Dijkstra\'s algorithm might fail or run indefinitely.'
      }
    ]
  },
  {
    id: 'quiz_dbms_core',
    customId: 'quiz_dbms_core',
    title: 'DBMS & Transactional Integrity',
    description: 'A core test on database normal forms, ACID properties, indexing optimization, and SQL aggregates.',
    timeLimit: 6,
    passPercentage: 65,
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
  },
  {
    id: 'quiz_fullstack_coding',
    customId: 'quiz_fullstack_coding',
    title: 'Full-Stack JavaScript & DSA Coding Challenge',
    description: 'Solve real-time coding challenges with automated test-case runner, split-screen IDE, and instant code evaluation.',
    timeLimit: 15,
    passPercentage: 70,
    category: 'Coding & Algorithms',
    questions: [
      {
        text: 'Two Sum Problem: Write a function `twoSum(nums, target)` that returns the indices of the two numbers such that they add up to target. Return as array `[idx1, idx2]`.',
        questionType: 'coding',
        language: 'javascript',
        slug: 'two-sum',
        boilerplateCode: 'function twoSum(nums, target) {\n  // Write your solution here\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) {\n      return [map[complement], i];\n    }\n    map[nums[i]] = i;\n  }\n  return [];\n}',
        templates: {
          javascript: 'function twoSum(nums, target) {\n  // Write your solution here\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) return [map[complement], i];\n    map[nums[i]] = i;\n  }\n  return [];\n}',
          python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    seen = {}\n    for i, x in enumerate(nums):\n        comp = target - x\n        if comp in seen:\n            return [seen[comp], i]\n        seen[x] = i\n    return []',
          cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};',
          java: 'import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}'
        },
        testCases: [
          { input: '[2, 7, 11, 15], 9', expectedOutput: '0,1' },
          { input: '[3, 2, 4], 6', expectedOutput: '1,2' },
          { input: '[3, 3], 6', expectedOutput: '0,1' }
        ],
        options: [],
        correctIndex: 0,
        explanation: 'Uses a hash map to achieve O(n) linear time complexity.'
      },
      {
        text: 'Valid Palindrome: Write a function `isPalindrome(s)` that returns true if the string is a palindrome ignoring cases and non-alphanumeric characters, otherwise false.',
        questionType: 'coding',
        language: 'javascript',
        slug: 'valid-palindrome',
        boilerplateCode: 'function isPalindrome(s) {\n  // Write your solution here\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
        templates: {
          javascript: 'function isPalindrome(s) {\n  // Write your solution here\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
          python: 'def isPalindrome(s: str) -> bool:\n    # Write your solution here\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]',
          cpp: '#include <string>\n#include <cctype>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        string clean = "";\n        for (char c : s) if (isalnum(c)) clean += tolower(c);\n        int l = 0, r = clean.length() - 1;\n        while (l < r) {\n            if (clean[l++] != clean[r--]) return false;\n        }\n        return true;\n    }\n};',
          java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        String clean = s.toLowerCase().replaceAll("[^a-z0-9]", "");\n        return clean.equals(new StringBuilder(clean).reverse().toString());\n    }\n}'
        },
        testCases: [
          { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
          { input: '"race a car"', expectedOutput: 'false' },
          { input: '" "', expectedOutput: 'true' }
        ],
        options: [],
        correctIndex: 0,
        explanation: 'Check symmetry after cleaning string.'
      },
      {
        text: 'Which data structure offers average O(1) time complexity for lookup, insert, and delete operations?',
        questionType: 'mcq',
        options: ['Binary Search Tree', 'Hash Map (Hash Table)', 'Linked List', 'Array'],
        correctIndex: 1,
        explanation: 'A Hash Table computes index using hash function for average O(1) operations.'
      }
    ]
  }
];

function getCurrentUserEmail() {
  try {
    const user = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
    return user ? user.email : null;
  } catch (e) {
    return null;
  }
}

const QuizStorage = {
  // Sync memory cache
  _cachedQuizzes: null,

  getQuizzes() {
    // 1. Trigger asynchronous background sync with MongoDB
    if (window.TechPrepAPI && window.TechPrepAPI.getQuizzes) {
      window.TechPrepAPI.getQuizzes().then(res => {
        if (res.success && Array.isArray(res.quizzes) && res.quizzes.length > 0) {
          const formatted = res.quizzes.map(q => ({
            ...q,
            id: q.customId || q._id || q.id
          }));
          localStorage.setItem(QUIZZES_KEY, JSON.stringify(formatted));
          this._cachedQuizzes = formatted;
        }
      }).catch(() => {});
    }

    if (this._cachedQuizzes) return this._cachedQuizzes;

    try {
      let data = localStorage.getItem(QUIZZES_KEY);
      if (!data) {
        localStorage.setItem(QUIZZES_KEY, JSON.stringify(SEED_QUIZZES));
        return SEED_QUIZZES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error fetching quizzes:', e);
      return SEED_QUIZZES;
    }
  },

  async fetchQuizzesAsync() {
    if (window.TechPrepAPI && window.TechPrepAPI.getQuizzes) {
      const res = await window.TechPrepAPI.getQuizzes();
      if (res.success && Array.isArray(res.quizzes)) {
        const formatted = res.quizzes.map(q => ({
          ...q,
          id: q.customId || q._id || q.id
        }));
        localStorage.setItem(QUIZZES_KEY, JSON.stringify(formatted));
        this._cachedQuizzes = formatted;
        return formatted;
      }
    }
    return this.getQuizzes();
  },

  saveQuizzes(quizzes) {
    try {
      localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
      this._cachedQuizzes = quizzes;
      return true;
    } catch (e) {
      console.error('Error saving quizzes:', e);
      return false;
    }
  },

  getQuizById(id) {
    const quizzes = this.getQuizzes();
    return quizzes.find(q => (q.id === id || q.customId === id || q._id === id)) || null;
  },

  saveQuiz(quiz) {
    const quizzes = this.getQuizzes();
    const index = quizzes.findIndex(q => (q.id === quiz.id || q.customId === quiz.id || q._id === quiz.id));

    if (index > -1) {
      quizzes[index] = quiz;
    } else {
      quizzes.push(quiz);
    }
    this.saveQuizzes(quizzes);

    // Sync to MongoDB backend
    if (window.TechPrepAPI && window.TechPrepAPI.saveQuiz) {
      window.TechPrepAPI.saveQuiz({
        ...quiz,
        customId: quiz.id || quiz.customId
      }).catch(err => console.warn('Quiz async backend sync error:', err));
    }

    return true;
  },

  deleteQuiz(id) {
    const quizzes = this.getQuizzes();
    const filtered = quizzes.filter(q => (q.id !== id && q.customId !== id && q._id !== id));
    this.saveQuizzes(filtered);

    // Sync deletion to MongoDB backend
    if (window.TechPrepAPI && window.TechPrepAPI.deleteQuiz) {
      window.TechPrepAPI.deleteQuiz(id).catch(err => console.warn('Quiz async delete error:', err));
    }

    return true;
  },

  getUserResults(email = null) {
    const activeEmail = email || getCurrentUserEmail();
    const key = activeEmail ? `${RESULTS_KEY}_${activeEmail}` : `${RESULTS_KEY}_guest`;

    // Trigger backend fetch async
    if (window.TechPrepAPI && window.TechPrepAPI.getStudentQuizResults && activeEmail) {
      window.TechPrepAPI.getStudentQuizResults(activeEmail).then(res => {
        if (res.success && Array.isArray(res.results)) {
          localStorage.setItem(key, JSON.stringify(res.results));
        }
      }).catch(() => {});
    }

    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error fetching results:', e);
      return [];
    }
  },

  saveUserResult(result) {
    try {
      const activeEmail = result.studentEmail || getCurrentUserEmail();
      const key = activeEmail ? `${RESULTS_KEY}_${activeEmail}` : `${RESULTS_KEY}_guest`;
      const results = this.getUserResults(activeEmail);
      const record = {
        ...result,
        studentEmail: activeEmail,
        timestamp: new Date().toISOString()
      };
      results.push(record);
      localStorage.setItem(key, JSON.stringify(results));

      // Sync to MongoDB backend
      if (window.TechPrepAPI && window.TechPrepAPI.submitQuizResult) {
        window.TechPrepAPI.submitQuizResult(record).catch(err => console.warn('Quiz result backend sync error:', err));
      }

      return true;
    } catch (e) {
      console.error('Error saving results:', e);
      return false;
    }
  },

  resetAllQuizzes() {
    try {
      localStorage.setItem(QUIZZES_KEY, JSON.stringify(SEED_QUIZZES));
      this._cachedQuizzes = SEED_QUIZZES;
      return true;
    } catch (e) {
      return false;
    }
  }
};

window.QuizStorage = QuizStorage;
