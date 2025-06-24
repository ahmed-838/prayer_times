import { PrayerTimesData } from '@/types/prayerTimes';

/**
 * تحديد الصلاة التالية بناءً على الوقت الحالي
 */
export const determineNextPrayer = (times: PrayerTimesData | null): string | null => {
  if (!times) return null;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;
  
  const prayers = [
    { name: 'fajr', time: times.fajr },
    { name: 'sunrise', time: times.sunrise },
    { name: 'dhuhr', time: times.dhuhr },
    { name: 'asr', time: times.asr },
    { name: 'maghrib', time: times.maghrib },
    { name: 'isha', time: times.isha }
  ];
  
  // البحث عن أول صلاة لم تحن بعد
  for (const prayer of prayers) {
    const [prayerHour, prayerMinute] = prayer.time.split(':').map(Number);
    const prayerTime = prayerHour * 60 + prayerMinute;
    
    if (prayerTime > currentTime) {
      return prayer.name;
    }
  }
  
  // إذا مرت جميع الصلوات، فالصلاة التالية هي الفجر غداً
  return 'fajr';
};

/**
 * تنسيق التاريخ بالعربية
 */
export const formatArabicDate = (): string => {
  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
  return date.toLocaleDateString('ar-EG', options);
};
