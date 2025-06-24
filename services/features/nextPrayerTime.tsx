import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTimeFormat } from '@/services/features/hours_types';
import { PrayerTimesData } from '@/types/prayerTimes';

interface NextPrayerTimeProps {
  prayerTimes: PrayerTimesData;
  nextPrayer: string | null;
  cityName: string;
}

export default function NextPrayerTime({ prayerTimes, nextPrayer, cityName }: NextPrayerTimeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [remainingTime, setRemainingTime] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });
  const { use24HourFormat } = useTimeFormat();
  const colorScheme = useColorScheme();
  
  // أسماء الصلوات بالعربي
  const prayerNames = {
    'fajr': 'الفجر',
    'sunrise': 'الشروق',
    'dhuhr': 'الظهر',
    'asr': 'العصر',
    'maghrib': 'المغرب',
    'isha': 'العشاء',
  };
  
  // تحديث الساعة كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // حساب الوقت المتبقي للصلاة القادمة
  useEffect(() => {
    if (!prayerTimes || !nextPrayer) return;
    
    const calculateTimeRemaining = () => {
      // الحصول على وقت الصلاة القادمة
      const nextPrayerTime = prayerTimes[nextPrayer as keyof PrayerTimesData];
      if (!nextPrayerTime) return;
      
      // تحويل وقت الصلاة إلى كائن Date
      const [prayerHours, prayerMinutes] = nextPrayerTime.split(':').map(Number);
      const now = new Date();
      let prayerDate = new Date();
      prayerDate.setHours(prayerHours, prayerMinutes, 0, 0);
      
      // إذا كان وقت الصلاة قد مر، فإنها ستكون في اليوم التالي
      if (prayerDate < now && nextPrayer === 'fajr') {
        prayerDate.setDate(prayerDate.getDate() + 1);
      }
      
      // حساب الفرق بالمللي ثانية
      let diff = prayerDate.getTime() - now.getTime();
      
      if (diff < 0) {
        // إذا كانت القيمة سالبة، فالصلاة في اليوم التالي
        prayerDate.setDate(prayerDate.getDate() + 1);
        diff = prayerDate.getTime() - now.getTime();
      }
      
      // تحويل المللي ثانية إلى ساعات ودقائق وثواني
      const remainingHours = Math.floor(diff / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const remainingSeconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setRemainingTime({ hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds });
    };
    
    // حساب الوقت المتبقي فوراً
    calculateTimeRemaining();
    
    // ثم تحديثه كل ثانية
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes, nextPrayer, currentTime]);
  
  // تنسيق الوقت الحالي
  const formattedCurrentTime = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    
    if (use24HourFormat) {
      return `${hours}:${minutes}:${seconds}`;
    } else {
      const period = hours >= 12 ? 'م' : 'ص';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes}:${seconds} ${period}`;
    }
  };

  return (
    <ThemedView style={[
      styles.container, 
      { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F0F9FF' }
    ]}>
      <ThemedView style={styles.timeContainer}>
        <ThemedText style={styles.currentTimeLabel}>الوقت الحالي</ThemedText>
        <ThemedText style={styles.currentTime}>{formattedCurrentTime()}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.divider} />
      
      {nextPrayer && (
        <ThemedView style={styles.nextPrayerContainer}>
          <ThemedText style={styles.nextPrayerLabel}>
            متبقي على صلاة {prayerNames[nextPrayer as keyof typeof prayerNames] || nextPrayer}
          </ThemedText>
          
          <ThemedView style={styles.countdownContainer}>
            <CountdownUnit value={remainingTime.hours} label="ساعة" />
            <CountdownUnit value={remainingTime.minutes} label="دقيقة" />
            <CountdownUnit value={remainingTime.seconds} label="ثانية" />
          </ThemedView>
          
          <ThemedText style={styles.cityName}>
            حسب توقيت {cityName}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

// مكون وحدة العد التنازلي
interface CountdownUnitProps {
  value: number;
  label: string;
}

function CountdownUnit({ value, label }: CountdownUnitProps) {
  const colorScheme = useColorScheme();
  
  return (
    <ThemedView style={[
      styles.countdownUnit,
      { backgroundColor: colorScheme === 'dark' ? '#374151' : '#E1F5FE' }
    ]}>
      <ThemedText style={styles.countdownValue}>{value.toString().padStart(2, '0')}</ThemedText>
      <ThemedText style={styles.countdownLabel}>{label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  currentTimeLabel: {
    fontSize: 14,
    marginBottom: 5,
    opacity: 0.7,
  },
  currentTime: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
    width: '100%',
  },
  nextPrayerContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  nextPrayerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 10,
  },
  countdownUnit: {
    alignItems: 'center',
    minWidth: 60,
    borderRadius: 10,
    padding: 10,
  },
  countdownValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  countdownLabel: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  cityName: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 5,
  }
});
