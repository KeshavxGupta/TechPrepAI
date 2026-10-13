/**
 * Static Analysis Big-O Complexity Estimator
 */
function estimateComplexity(code, language) {
  const cleanCode = (code || '').replace(/\/\*.*?\*\/|\/\/.*$/gm, '');

  let loopDepth = 0;
  const loopMatches = cleanCode.match(/\b(for|while)\s*\(/g) || [];
  
  if (loopMatches.length >= 3) {
    return { timeComplexity: 'O(N^3)', spaceComplexity: 'O(1)', note: 'High order polynomial complexity detected.' };
  } else if (loopMatches.length === 2) {
    return { timeComplexity: 'O(N^2)', spaceComplexity: 'O(1)', note: 'Nested iterations detected.' };
  } else if (loopMatches.length === 1) {
    return { timeComplexity: 'O(N)', spaceComplexity: 'O(1)', note: 'Linear single-pass algorithm.' };
  }

  return { timeComplexity: 'O(1)', spaceComplexity: 'O(1)', note: 'Constant time complexity.' };
}

module.exports = { estimateComplexity };
