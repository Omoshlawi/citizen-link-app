import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";

/**
 * AsyncStorage adapter for Zustand persist middleware
 * Works across web, iOS, and Android platforms
 * Ensures values are always serialized as strings
 */
export const asyncStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value;
    } catch (error) {
      console.error(`Error getting item ${name} from AsyncStorage:`, error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      // Ensure value is always a string (Zustand should serialize, but be defensive)
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(name, stringValue);
    } catch (error) {
      console.error(`Error setting item ${name} in AsyncStorage:`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.error(`Error removing item ${name} from AsyncStorage:`, error);
    }
  },
};
