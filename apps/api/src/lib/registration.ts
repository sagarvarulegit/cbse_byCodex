export const PILOT_CLASS_LEVEL = 10;

export function normalizeRegistrationClassLevel(value: unknown) {
  const normalizedValue = typeof value === 'string' ? value.trim() : typeof value === 'number' ? String(value) : '';
  if (!normalizedValue) {
    return {
      classLevel: null,
      error: 'Please choose your class to continue.',
    };
  }

  const parsedValue = Number(normalizedValue);
  if (!Number.isInteger(parsedValue)) {
    return {
      classLevel: null,
      error: 'Please choose your class to continue.',
    };
  }

  if (parsedValue !== PILOT_CLASS_LEVEL) {
    return {
      classLevel: null,
      error: 'Class 10 registrations are live right now. Classes 1 to 9 are coming soon.',
    };
  }

  return {
    classLevel: parsedValue,
    error: null,
  };
}
