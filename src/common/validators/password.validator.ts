/**
 * Validates password strength
 * Password must be at least 12 characters and contain:
 * - Uppercase letters
 * - Lowercase letters
 * - Numbers
 * - Special characters
 * - Should not contain common weak patterns
 */
export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] };
  }

  // Password must be at least 12 characters
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  // Must contain uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Must contain lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Must contain numbers
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Must contain special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  // Check for common weak patterns
  const weakPatterns = [
    'password',
    'pass',
    'admin',
    'admin123',
    '12345',
    'qwerty',
    'abc123',
    'letmein',
    'welcome',
    '123456',
    'password123',
    'test',
    'root',
  ];

  const lowerPass = password.toLowerCase();
  for (const pattern of weakPatterns) {
    if (lowerPass.includes(pattern)) {
      errors.push(`Password cannot contain common patterns like "${pattern}"`);
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
