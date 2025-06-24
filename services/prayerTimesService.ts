import { DateInfo, PrayerTimesData } from '@/types/prayerTimes';

interface ApiResponse {
  code: number;
  status: string;
  data: {
    timings: ApiTimings;
    date: DateInfo;
  };
}

// Interface that matches the actual API response structure with capitalized properties
interface ApiTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string; // To accommodate any additional timing values
}

// API base URL
const API_BASE_URL = 'http://api.aladhan.com/v1/timingsByCity';

/**
 * Get prayer times for a specific city
 * 
 * @param {string} city - The name of the city
 * @returns {Promise<{timings: PrayerTimesData, date: DateInfo}>} - Prayer times and date info
 */
export async function getPrayerTimes(city: string): Promise<{timings: PrayerTimesData, date: DateInfo}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}?city=${encodeURIComponent(city)}&country=Egypt`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data: ApiResponse = await response.json();
    const apiTimings = data.data.timings;
    
    // Converting from API response format to our internal format
    const formattedTimings: PrayerTimesData = {
      fajr: formatTime(apiTimings.Fajr),
      sunrise: formatTime(apiTimings.Sunrise),
      dhuhr: formatTime(apiTimings.Dhuhr),
      asr: formatTime(apiTimings.Asr),
      maghrib: formatTime(apiTimings.Maghrib),
      isha: formatTime(apiTimings.Isha),
    };
    
    return {
      timings: formattedTimings,
      date: data.data.date
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

/**
 * Format the time string from API
 */
function formatTime(timeStr: string): string {
  // Remove the timezone suffix if present
  return timeStr.split(' ')[0];
}
