/**
 * CUSIP Check-Digit Validator and Calculation Utilities
 * 
 * Implements the standard CUSIP check-digit algorithm as detailed in
 * Chapter 43 of "Rights, Genomes, and Algorithms" and ANSI X9.6 standard:
 * - Positions 1-6: Issuer alphanumeric code
 * - Positions 7-8: Issue alphanumeric code
 * - Position 9: Check digit calculated via modified Luhn algorithm
 *   (Letters mapped to ordinals: A=10, B=11 ... Z=35; odd positions x1, even positions x2; sum digits of products; mod 10)
 */

export interface CusipValidationResult {
  isValid: boolean;
  normalizedCusip: string;
  issuerCode: string;
  issueCode: string;
  actualCheckDigit: number | null;
  expectedCheckDigit: number | null;
  errorMessage?: string;
}

/**
 * Calculates the standard CUSIP check digit for an 8-character CUSIP stem.
 * Returns null if the stem is invalid.
 */
export function calculateCusipCheckDigit(stem: string): number | null {
  if (!stem) return null;
  const cleanStem = stem.toUpperCase().replace(/[^0-9A-Z*@#]/g, '');
  if (cleanStem.length < 8) return null;

  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const char = cleanStem[i];
    let val = 0;

    if (char >= '0' && char <= '9') {
      val = parseInt(char, 10);
    } else if (char >= 'A' && char <= 'Z') {
      val = char.charCodeAt(0) - 55; // 'A' -> 10, 'B' -> 11, etc.
    } else if (char === '*') {
      val = 36;
    } else if (char === '@') {
      val = 37;
    } else if (char === '#') {
      val = 38;
    } else {
      return null;
    }

    // Even index in 0-indexed loop corresponds to odd position (1st, 3rd, 5th, 7th) -> weight 1
    // Odd index in 0-indexed loop corresponds to even position (2nd, 4th, 6th, 8th) -> weight 2
    let product = (i % 2 === 1) ? val * 2 : val * 1;

    // Sum the decimal digits of the product
    while (product > 0) {
      sum += product % 10;
      product = Math.floor(product / 10);
    }
  }

  return (10 - (sum % 10)) % 10;
}

/**
 * Validates a 9-character CUSIP or 8-character stem.
 */
export function validateCusip(rawCusip: string): CusipValidationResult {
  if (!rawCusip) {
    return {
      isValid: false,
      normalizedCusip: '',
      issuerCode: '',
      issueCode: '',
      actualCheckDigit: null,
      expectedCheckDigit: null,
      errorMessage: 'CUSIP cannot be empty.'
    };
  }

  const cleaned = rawCusip.toUpperCase().replace(/[^0-9A-Z*@#]/g, '');

  if (cleaned.length < 8) {
    return {
      isValid: false,
      normalizedCusip: cleaned,
      issuerCode: cleaned.slice(0, 6),
      issueCode: cleaned.slice(6),
      actualCheckDigit: null,
      expectedCheckDigit: null,
      errorMessage: `CUSIP stem must be at least 8 characters (current: ${cleaned.length}).`
    };
  }

  const stem = cleaned.slice(0, 8);
  const expectedCheckDigit = calculateCusipCheckDigit(stem);

  if (expectedCheckDigit === null) {
    return {
      isValid: false,
      normalizedCusip: cleaned,
      issuerCode: stem.slice(0, 6),
      issueCode: stem.slice(6, 8),
      actualCheckDigit: null,
      expectedCheckDigit: null,
      errorMessage: 'Invalid characters in CUSIP stem.'
    };
  }

  if (cleaned.length === 8) {
    // 8-character stem provided: compute and propose full 9-char CUSIP
    return {
      isValid: false,
      normalizedCusip: `${stem}${expectedCheckDigit}`,
      issuerCode: stem.slice(0, 6),
      issueCode: stem.slice(6, 8),
      actualCheckDigit: null,
      expectedCheckDigit: expectedCheckDigit,
      errorMessage: `8-character stem provided. Check digit should be ${expectedCheckDigit}.`
    };
  }

  const actualCheckDigit = parseInt(cleaned[8], 10);

  if (isNaN(actualCheckDigit)) {
    return {
      isValid: false,
      normalizedCusip: cleaned.slice(0, 9),
      issuerCode: stem.slice(0, 6),
      issueCode: stem.slice(6, 8),
      actualCheckDigit: null,
      expectedCheckDigit,
      errorMessage: '9th character must be a numeric check digit (0-9).'
    };
  }

  const isValid = actualCheckDigit === expectedCheckDigit;

  return {
    isValid,
    normalizedCusip: cleaned.slice(0, 9),
    issuerCode: stem.slice(0, 6),
    issueCode: stem.slice(6, 8),
    actualCheckDigit,
    expectedCheckDigit,
    errorMessage: isValid 
      ? undefined 
      : `Check digit mismatch: got ${actualCheckDigit}, expected ${expectedCheckDigit} (Luhn mod-10).`
  };
}

/**
 * Format CUSIP with standard spacing (e.g., "917292 AA 1" or "917292-AA-1")
 */
export function formatCusipSpaced(raw: string): string {
  const clean = raw.toUpperCase().replace(/[^0-9A-Z*@#]/g, '');
  if (clean.length <= 6) return clean;
  if (clean.length <= 8) return `${clean.slice(0, 6)} ${clean.slice(6)}`;
  return `${clean.slice(0, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 9)}`;
}
