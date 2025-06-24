import { PrayerTimesData } from '@/types/prayerTimes';

// API base URL
const API_BASE_URL = 'http://api.aladhan.com/v1/timingsByCity';

/**
 * Get prayer times for a specific city
 * 
 * @param {string} city - The name of the city
 * @returns {Promise<PrayerTimesData>} - Prayer times
 */
export async function getPrayerTimes(city: string): Promise<PrayerTimesData> {
  try {
    // Set country to Egypt since we're focusing on Egyptian governorates
    const country = 'Egypt';
    const method = 5; // Egyptian General Authority of Survey

    // Get today's date
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const url = `${API_BASE_URL}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}&month=${month}&year=${year}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get the timings from response
    const timings = data.data.timings;
    
    // Return formatted prayer times
    return {
      fajr: formatTime(timings.Fajr),
      sunrise: formatTime(timings.Sunrise),
      dhuhr: formatTime(timings.Dhuhr),
      asr: formatTime(timings.Asr),
      maghrib: formatTime(timings.Maghrib),
      isha: formatTime(timings.Isha),
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
