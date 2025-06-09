
// Web-compatible storage utility
export const Storage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};
