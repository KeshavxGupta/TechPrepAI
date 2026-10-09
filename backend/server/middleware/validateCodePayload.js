/**
 * Request payload validator for code compilation requests
 */
const SUPPORTED_LANGUAGES = ['javascript', 'python', 'cpp', 'java', 'node'];
const MAX_CODE_BYTES = 64 * 1024; // 64 KB limit
const MAX_INPUT_BYTES = 32 * 1024; // 32 KB limit

function validateCodePayload(req, res, next) {
  const { language, code, customInput, testCases } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Code is required and must be a string.'
    });
  }

  if (Buffer.byteLength(code, 'utf8') > MAX_CODE_BYTES) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Source code exceeds maximum allowable limit of 64KB.'
    });
  }

  if (language && !SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Validation Error: Unsupported language '${language}'. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`
    });
  }

  if (customInput && Buffer.byteLength(String(customInput), 'utf8') > MAX_INPUT_BYTES) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Custom input exceeds maximum limit of 32KB.'
    });
  }

  if (testCases && !Array.isArray(testCases)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: testCases must be an array of testcase objects.'
    });
  }

  next();
}

module.exports = validateCodePayload;
