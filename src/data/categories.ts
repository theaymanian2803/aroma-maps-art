const CATEGORIES_STORAGE_KEY = 'admin_categories';

const defaultCategories: string[] = [
  'Single Origin',
  'Blends',
  'Espresso',
  'Decaf',
];

export const getCategories = (): string[] => {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error reading categories:', e);
  }
  return defaultCategories;
};

export const saveCategories = (categories: string[]): void => {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Error saving categories:', e);
  }
};

export const resetCategories = (): string[] => {
  localStorage.removeItem(CATEGORIES_STORAGE_KEY);
  return defaultCategories;
};

export { defaultCategories };
