const sampleCodeSnippets = {
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (mp.count(complement)) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hash_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hash_map:
                return [hash_map[complement], i]
            hash_map[num] = i
        return []`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
  javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
};

function initDsaCodeRunner() {
  const langSelect = document.getElementById('code-lang-select');
  const codeEditorTextarea = document.getElementById('code-editor-textarea');
  const runBtn = document.getElementById('run-code-btn');
  const consoleOutput = document.getElementById('code-console-output');

  if (!langSelect || !codeEditorTextarea || !runBtn || !consoleOutput) return;

  langSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    if (sampleCodeSnippets[lang]) {
      codeEditorTextarea.value = sampleCodeSnippets[lang];
    }
  });

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Compiling...
    `;

    consoleOutput.innerHTML = `
      <div class="text-neutral-400 font-mono text-xs animate-pulse">
        > Compiling solution with optimization flags (-O3)...
        > Executing Test Suite: 3/3 Cases...
      </div>
    `;

    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = `
        <svg class="w-4 h-4 mr-1.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Run Code
      `;

      consoleOutput.innerHTML = `
        <div class="space-y-2 font-mono text-xs">
          <div class="flex items-center text-emerald-500 font-semibold">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            STATUS: ACCEPTED (Passed 3/3 Testcases)
          </div>
          <div class="grid grid-cols-3 gap-2 text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900/60 p-2.5 rounded border border-neutral-200 dark:border-neutral-800">
            <div><span class="text-neutral-400 block text-[10px]">RUNTIME</span> <strong class="text-neutral-900 dark:text-neutral-200">12 ms</strong> (Beats 94.8%)</div>
            <div><span class="text-neutral-400 block text-[10px]">MEMORY</span> <strong class="text-neutral-900 dark:text-neutral-200">14.2 MB</strong> (Beats 91.2%)</div>
            <div><span class="text-neutral-400 block text-[10px]">COMPLEXITY</span> <strong class="text-blue-500">O(N) Time, O(N) Space</strong></div>
          </div>
          <div class="text-neutral-600 dark:text-neutral-400 pt-1">
            <span class="text-neutral-400">Testcase 1:</span> nums = [2,7,11,15], target = 9 &rarr; <span class="text-emerald-500 font-semibold">[0,1]</span> (Expected: [0,1])<br>
            <span class="text-neutral-400">Testcase 2:</span> nums = [3,2,4], target = 6 &rarr; <span class="text-emerald-500 font-semibold">[1,2]</span> (Expected: [1,2])<br>
            <span class="text-neutral-400">Testcase 3:</span> nums = [3,3], target = 6 &rarr; <span class="text-emerald-500 font-semibold">[0,1]</span> (Expected: [0,1])
          </div>
        </div>
      `;
    }, 900);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDsaCodeRunner();
});



