/**
 * Master collection of comprehensive test case fixtures
 */
module.exports = {
  'two-sum': [
    { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
    { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
    { input: '[3,3]\n6', expectedOutput: '[0,1]' },
    { input: '[1,5,8,3]\n11', expectedOutput: '[2,3]' },
    { input: '[-1,-2,-3,-4,-5]\n-8', expectedOutput: '[2,4]' }
  ],
  'valid-palindrome': [
    { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
    { input: '"race a car"', expectedOutput: 'false' },
    { input: '" "', expectedOutput: 'true' },
    { input: '"0P"', expectedOutput: 'false' },
    { input: '"ab_a"', expectedOutput: 'true' }
  ],
  'valid-anagram': [
    { input: '"anagram"\n"nagaram"', expectedOutput: 'true' },
    { input: '"rat"\n"car"', expectedOutput: 'false' },
    { input: '"a"\n"a"', expectedOutput: 'true' },
    { input: '"ab"\n"a"', expectedOutput: 'false' }
  ],
  'container-with-most-water': [
    { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
    { input: '[1,1]', expectedOutput: '1' },
    { input: '[4,3,2,1,4]', expectedOutput: '16' }
  ],
  'coin-change': [
    { input: '[1,2,5]\n11', expectedOutput: '3' },
    { input: '[2]\n3', expectedOutput: '-1' },
    { input: '[1]\n0', expectedOutput: '0' }
  ]
};
