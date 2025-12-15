/**
 * Loads data from localStorage with a fallback value.
 * Handles JSON parsing and errors gracefully.
 */
export const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return fallback;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn(`Failed to load ${key} from localStorage:`, err);
    return fallback;
  }
};

/**
 * Saves data to localStorage.
 * Handles serialization and errors gracefully.
 */
export const saveToStorage = <T>(key: string, state: T): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
  }
};
