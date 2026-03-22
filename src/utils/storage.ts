
export const STORAGE_KEYS = {
  FAVORITES: 'veda_vani_favorites',
  BOOKMARKS: 'veda_vani_bookmarks',
  PROGRESS: 'veda_vani_progress',
};

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export interface UserProgress {
  [bookId: string]: number; // current page index
}

export interface UserBookmarks {
  [bookId: string]: number[]; // array of bookmarked page indices
}

export interface UserFavorites {
  [bookId: string]: boolean;
}
