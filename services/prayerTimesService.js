/**
 * Service for fetching prayer times from an API
 */

// We'll use the Aladhan API to get prayer times
const API_BASE_URL = 'http://api.aladhan.com/v1/timingsByCity';

/**
 * Get prayer times for a specific city
 * 
 * @param {string} city - The name of the city
 * @returns {Promise<Object>} - Prayer times
 */
export async function getPrayerTimes(city) {
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
    
    // Format and return the prayer times for today
    const timings = data.data.timings;
    
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
 * Format the time string 
 * @param {string} timeStr - Time string from API (e.g., "04:23")
 * @returns {string} - Formatted time
 */
function formatTime(timeStr) {
  // The API returns time in 24-hour format with (EET) suffix
  // We'll remove the suffix and keep the time
  return timeStr.split(' ')[0];
}
