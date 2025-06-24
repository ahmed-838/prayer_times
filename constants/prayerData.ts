import { IconMap } from '@/types/prayerTimes';

// قائمة المحافظات المصرية الكاملة
export const egyptianGovernorates = [
  'القاهرة',
  'الإسكندرية',
  'الإسماعيلية', 
  'أسوان',
  'أسيوط',
  'الأقصر',
  'البحر الأحمر',
  'البحيرة',
  'بني سويف',
  'بورسعيد',
  'جنوب سيناء',
  'الجيزة',
  'الدقهلية',
  'دمياط',
  'سوهاج',
  'السويس',
  'الشرقية',
  'شمال سيناء',
  'الغربية',
  'الفيوم',
  'القليوبية',
  'قنا',
  'كفر الشيخ',
  'مطروح',
  'المنوفية',
  'المنيا',
  'الوادي الجديد'
];

// مخطط المدن: اسم المدينة بالعربية -> اسم المدينة بالإنجليزية للواجهة البرمجية
export const cityMapping: Record<string, string> = {
  'القاهرة': 'Cairo',
  'الإسكندرية': 'Alexandria',
  'الإسماعيلية': 'Ismailia',
  'أسوان': 'Aswan',
  'أسيوط': 'Asyut',
  'الأقصر': 'Luxor',
  'البحر الأحمر': 'Hurghada', // استخدام الغردقة كممثل للبحر الأحمر
  'البحيرة': 'Damanhur', // استخدام دمنهور عاصمة البحيرة
  'بني سويف': 'Beni Suef',
  'بورسعيد': 'Port Said',
  'جنوب سيناء': 'Sharm El-Sheikh', // استخدام شرم الشيخ كممثل لجنوب سيناء
  'الجيزة': 'Giza',
  'الدقهلية': 'Mansoura', // استخدام المنصورة
  'دمياط': 'Damietta',
  'سوهاج': 'Sohag',
  'السويس': 'Suez',
  'الشرقية': 'Zagazig', // استخدام الزقازيق
  'شمال سيناء': 'Arish', // استخدام العريش
  'الغربية': 'Tanta', // استخدام طنطا
  'الفيوم': 'Faiyum',
  'القليوبية': 'Banha', // استخدام بنها
  'قنا': 'Qena',
  'كفر الشيخ': 'Kafr El Sheikh',
  'مطروح': 'Marsa Matruh',
  'المنوفية': 'Shibin El Kom', // استخدام شبين الكوم
  'المنيا': 'Minya',
  'الوادي الجديد': 'Kharga' // استخدام الخارجة
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
