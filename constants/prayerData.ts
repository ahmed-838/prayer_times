import { CityMap, IconMap } from '@/types/prayerTimes';

// Egyptian governorates list in Arabic
export const egyptianGovernorates = [
  'القاهرة', 'الإسكندرية', 'الجيزة', 'شبرا الخيمة', 'بورسعيد', 'السويس',
  'الأقصر', 'أسوان', 'أسيوط', 'المحلة الكبرى', 'طنطا', 'المنصورة',
  'الفيوم', 'الزقازيق', 'الإسماعيلية', 'بني سويف', 'سوهاج'
];

// City mapping for API
export const cityMapping: CityMap = {
  'القاهرة': 'Cairo',
  'الإسكندرية': 'Alexandria',
  'الجيزة': 'Giza',
  'شبرا الخيمة': 'Shubra El-Kheima',
  'بورسعيد': 'Port Said',
  'السويس': 'Suez',
  'الأقصر': 'Luxor',
  'أسوان': 'Aswan',
  'أسيوط': 'Asyut',
  'المحلة الكبرى': 'Al Mahalla Al Kubra',
  'طنطا': 'Tanta',
  'المنصورة': 'Mansoura',
  'الفيوم': 'Faiyum',
  'الزقازيق': 'Zagazig',
  'الإسماعيلية': 'Ismailia',
  'بني سويف': 'Beni Suef',
  'سوهاج': 'Sohag'
};

// Prayer icons mapping
export const prayerIcons: IconMap = {
  fajr: "weather-sunset-up",
  sunrise: "white-balance-sunny",
  dhuhr: "weather-sunny",
  asr: "weather-partly-cloudy",
  maghrib: "weather-sunset-down",
  isha: "weather-night"
};

// Prayer Arabic names
export const prayerArabicNames: Record<string, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء"
};

// Theme colors for light/dark mode
export const getHeaderGradient = (isDark: boolean) => {
  return isDark
    ? ['#0D1B2A', '#1B263B'] 
    : ['#2196F3', '#64B5F6'];
};

export const getCardGradient = (isDark: boolean) => {
  return isDark
    ? ['#1E3A5F', '#16213E']
    : ['#E1F5FE', '#B3E5FC'];
};
