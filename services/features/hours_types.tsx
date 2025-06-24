import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Storage key for persisting the format preference
const TIME_FORMAT_STORAGE_KEY = 'prayer_times_hour_format';

// Interface for time format context
interface TimeFormatContextType {
  use24HourFormat: boolean;
  toggleTimeFormat: () => void;
  formatTime: (timeString: string) => string;
}

// Create context with default values
const TimeFormatContext = createContext<TimeFormatContextType>({
  use24HourFormat: false,
  toggleTimeFormat: () => {},
  formatTime: (timeString: string) => timeString,
});

/**
 * Provider component to manage time format state
 */
export const TimeFormatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to track if we're using 24-hour format
  const [use24HourFormat, setUse24HourFormat] = useState<boolean>(false);

  // Load saved preference on initial render
  useEffect(() => {
    const loadSavedFormat = async () => {
      try {
        const savedFormat = await AsyncStorage.getItem(TIME_FORMAT_STORAGE_KEY);
        if (savedFormat !== null) {
          setUse24HourFormat(savedFormat === 'true');
        }
      } catch (error) {
        console.error('Failed to load time format preference:', error);
      }
    };
    
    loadSavedFormat();
  }, []);

  /**
   * Toggle between 12-hour and 24-hour formats
   */
  const toggleTimeFormat = async () => {
    const newFormat = !use24HourFormat;
    setUse24HourFormat(newFormat);
    
    // Save preference
    try {
      await AsyncStorage.setItem(TIME_FORMAT_STORAGE_KEY, String(newFormat));
    } catch (error) {
      console.error('Failed to save time format preference:', error);
    }
  };

  /**
   * Convert time string to appropriate format (12 or 24 hour)
   * @param timeString - Time string in 24-hour format (HH:MM)
   * @returns Formatted time string
   */
  const formatTime = (timeString: string): string => {
    // If using 24-hour format, return as is
    if (use24HourFormat) {
      return timeString;
    }
    
    // Otherwise, convert to 12-hour format
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      
      if (isNaN(hours) || isNaN(minutes)) {
        return timeString; // Return original if parsing fails
      }
      
      const period = hours >= 12 ? 'م' : 'ص';
      const displayHours = hours % 12 || 12; // Convert 0 to 12
      
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  // Provide context values
  const contextValue = {
    use24HourFormat,
    toggleTimeFormat,
    formatTime,
  };

  return (
    <TimeFormatContext.Provider value={contextValue}>
      {children}
    </TimeFormatContext.Provider>
  );
};

// Custom hook to use the time format context
export const useTimeFormat = () => useContext(TimeFormatContext);