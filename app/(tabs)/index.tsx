import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getPrayerTimes } from '@/services/prayerTimesService';

// Define interface for prayer times data
interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// Egyptian governorates list in Arabic
const egyptianGovernorates = [
  'القاهرة', 'الإسكندرية', 'الجيزة', 'شبرا الخيمة', 'بورسعيد', 'السويس',
  'الأقصر', 'أسوان', 'أسيوط', 'المحلة الكبرى', 'طنطا', 'المنصورة',
  'الفيوم', 'الزقازيق', 'الإسماعيلية', 'بني سويف', 'سوهاج'
];

// City mapping for API
const cityMapping: Record<string, string> = {
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

// Prayer icons mapping with proper types
const prayerIcons: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  fajr: "weather-sunset-up",  // Changed from "sunrise" to a valid icon name
  sunrise: "white-balance-sunny",
  dhuhr: "weather-sunny",
  asr: "weather-partly-cloudy",
  maghrib: "weather-sunset-down",
  isha: "weather-night"
};

export default function PrayerTimesScreen() {
  const [selectedCity, setSelectedCity] = useState<keyof typeof cityMapping>('القاهرة');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
    setCurrentDate(date.toLocaleDateString('ar-EG', options));
    
    const fetchPrayerTimes = async () => {
      setLoading(true);
      try {
        // Use the English city name for API with proper TypeScript handling
        const times = await getPrayerTimes(cityMapping[selectedCity]);
        setPrayerTimes(times as PrayerTimesData);
        determineNextPrayer(times as PrayerTimesData);
      } catch (error) {
        console.error('Failed to fetch prayer times:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrayerTimes();
  }, [selectedCity]);

  const determineNextPrayer = (times: PrayerTimesData) => {
    if (!times) return;
    
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
    
    for (const prayer of prayers) {
      const [prayerHour, prayerMinute] = prayer.time.split(':').map(Number);
      const prayerTime = prayerHour * 60 + prayerMinute;
      
      if (prayerTime > currentTime) {
        setNextPrayer(prayer.name);
        return;
      }
    }
    
    // If all prayers have passed, next prayer is Fajr tomorrow
    setNextPrayer('fajr');
  };

  const getCardGradient = () => {
    return colorScheme === 'dark' 
      ? ['#1E3A5F', '#16213E']
      : ['#E1F5FE', '#B3E5FC'];
  };
  
  const getHeaderGradient = () => {
    return colorScheme === 'dark'
      ? ['#0D1B2A', '#1B263B'] 
      : ['#2196F3', '#64B5F6'];
  };

  return (
    <ThemedView style={[styles.container, 
      { backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF' }]}>
      
      <LinearGradient
        colors={getHeaderGradient()}
        style={styles.headerCard}>
        <ThemedText style={styles.dateText}>{currentDate}</ThemedText>
        <ThemedText style={styles.headerText}>مواقيت الصلاة</ThemedText>
        
        <View style={styles.pickerWrapper}>
          <MaterialCommunityIcons 
            name="map-marker" 
            size={24} 
            color={colorScheme === 'dark' ? '#FFFFFF' : '#FFFFFF'} 
            style={styles.pickerIcon} 
          />
          <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue) => setSelectedCity(itemValue)}
            style={[styles.picker, 
              { color: colorScheme === 'dark' ? '#FFFFFF' : '#FFFFFF' }]}
            dropdownIconColor={colorScheme === 'dark' ? '#FFFFFF' : '#FFFFFF'}>
            {egyptianGovernorates.map((city) => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        </View>
      </LinearGradient>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? "#64B5F6" : "#2196F3"} />
          <ThemedText style={styles.loadingText}>جاري تحميل مواقيت الصلاة...</ThemedText>
        </View>
      ) : prayerTimes ? (
        <View style={styles.timesContainer}>
          <PrayerTimeRow 
            name="الفجر" 
            time={prayerTimes.fajr} 
            icon={prayerIcons.fajr}
            isNext={nextPrayer === 'fajr'}
            colorScheme={colorScheme}
          />
          <PrayerTimeRow 
            name="الشروق" 
            time={prayerTimes.sunrise} 
            icon={prayerIcons.sunrise}
            isNext={nextPrayer === 'sunrise'}
            colorScheme={colorScheme}
          />
          <PrayerTimeRow 
            name="الظهر" 
            time={prayerTimes.dhuhr} 
            icon={prayerIcons.dhuhr}
            isNext={nextPrayer === 'dhuhr'}
            colorScheme={colorScheme}
          />
          <PrayerTimeRow 
            name="العصر" 
            time={prayerTimes.asr} 
            icon={prayerIcons.asr}
            isNext={nextPrayer === 'asr'}
            colorScheme={colorScheme}
          />
          <PrayerTimeRow 
            name="المغرب" 
            time={prayerTimes.maghrib} 
            icon={prayerIcons.maghrib}
            isNext={nextPrayer === 'maghrib'}
            colorScheme={colorScheme}
          />
          <PrayerTimeRow 
            name="العشاء" 
            time={prayerTimes.isha} 
            icon={prayerIcons.isha}
            isNext={nextPrayer === 'isha'}
            colorScheme={colorScheme}
          />
        </View>
      ) : (
        <ThemedText style={styles.noDataText}>لا توجد بيانات متاحة</ThemedText>
      )}

      <Image 
        source={require('@/assets/images/mosque_silhouette.png')} 
        style={[styles.backgroundImage, 
          { opacity: colorScheme === 'dark' ? 0.1 : 0.03 }]} 
        resizeMode="contain"
      />
    </ThemedView>
  );
}

function PrayerTimeRow({ name, time, icon, isNext, colorScheme }: 
  { name: string, time: string, icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'], isNext: boolean, colorScheme: string | null | undefined }) {
  
  // Ensure colorScheme is always a string
  const theme = colorScheme || 'light';
  
  // Background colors for each state
  const backgroundColor = isNext 
    ? theme === 'dark' ? '#2E4057' : '#E3F2FD'
    : theme === 'dark' ? '#1F2937' : '#FFFFFF';
  
  // Text color for each state
  const textColor = isNext
    ? theme === 'dark' ? '#90CAF9' : '#1565C0'
    : theme === 'dark' ? '#FFFFFF' : '#333333';
  
  return (
    <View style={[styles.prayerCard, { 
      backgroundColor: backgroundColor,
      borderColor: isNext 
        ? theme === 'dark' ? '#4D648D' : '#BBDEFB' 
        : theme === 'dark' ? '#2C3E50' : '#E0E0E0',
    }]}>
      <View style={styles.prayerIconContainer}>
        <MaterialCommunityIcons 
          name={icon} 
          size={24} 
          color={isNext 
            ? theme === 'dark' ? '#90CAF9' : '#1565C0'
            : theme === 'dark' ? '#AAAAAA' : '#757575'} 
        />
      </View>
      
      {/* Prayer time (switched position as requested) */}
      <ThemedText style={[styles.prayerTime, { color: textColor }]}>{time}</ThemedText>
      
      {/* Prayer name (switched position as requested) */}
      <ThemedText style={[styles.prayerName, { color: textColor }]}>{name}</ThemedText>
      
      {isNext && (
        <View style={[styles.nextPrayerBadge, {
          backgroundColor: theme === 'dark' ? '#4D648D' : '#1976D2'
        }]}>
          <ThemedText style={styles.nextPrayerText}>الصلاة التالية</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerCard: {
    width: '100%',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    opacity: 0.9,
    textAlign: 'center',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
  pickerIcon: {
    marginRight: 10,
  },
  picker: {
    width: '90%',
    height: 50,
  },
  timesContainer: {
    width: '90%',
    paddingVertical: 20,
  },
  prayerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  prayerIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  prayerName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  noDataText: {
    marginTop: 40,
    fontSize: 18,
    textAlign: 'center',
  },
  nextPrayerBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  nextPrayerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '60%',
    zIndex: -1,
  }
});
