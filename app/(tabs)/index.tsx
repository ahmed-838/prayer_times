import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { cityMapping, egyptianGovernorates, getHeaderGradient, prayerArabicNames, prayerIcons } from '@/constants/prayerData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTimeFormat } from '@/services/features/hours_types';
import { getPrayerTimes } from '@/services/prayerTimesService';
import { PrayerTimesData } from '@/types/prayerTimes';
import { determineNextPrayer, formatArabicDate } from '@/utils/prayerHelpers';

export default function PrayerTimesScreen() {
  const [selectedCity, setSelectedCity] = useState<keyof typeof cityMapping>('القاهرة');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    setCurrentDate(formatArabicDate());
    
    const fetchPrayerTimes = async () => {
      setLoading(true);
      try {
        // Use the English city name for API with proper TypeScript handling
        const times = await getPrayerTimes(cityMapping[selectedCity]);
        setPrayerTimes(times as PrayerTimesData);
        setNextPrayer(determineNextPrayer(times as PrayerTimesData));
      } catch (error) {
        console.error('Failed to fetch prayer times:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrayerTimes();
  }, [selectedCity]);

  return (
    <ThemedView style={[styles.container, 
      { backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF' }]}>
      
      <LinearGradient
        colors={getHeaderGradient(colorScheme === 'dark')}
        style={styles.headerCard}>
        <ThemedText style={styles.dateText}>{currentDate}</ThemedText>
        <ThemedText style={styles.headerText}>مواقيت الصلاة</ThemedText>
        
        <View style={styles.pickerWrapper}>
          <MaterialCommunityIcons 
            name="map-marker" 
            size={24} 
            color="#FFFFFF"
            style={styles.pickerIcon} 
          />
          <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue) => setSelectedCity(itemValue as keyof typeof cityMapping)}
            style={[styles.picker, { color: '#FFFFFF' }]}
            dropdownIconColor="#FFFFFF">
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
          {renderPrayerTimes(prayerTimes, nextPrayer, colorScheme)}
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

/**
 * Component for displaying a prayer time row
 */
function PrayerTimeRow({ name, time, icon, isNext, colorScheme }: 
  { name: string, time: string, icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'], isNext: boolean, colorScheme: string | null | undefined }) {
  
  // Get formatTime function
  const { formatTime } = useTimeFormat();
  
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
      
      {/* Prayer time - Now using the formatTime function */}
      <ThemedText style={[styles.prayerTime, { color: textColor }]}>{formatTime(time)}</ThemedText>
      
      {/* Prayer name */}
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

/**
 * Render prayer times rows
 */
function renderPrayerTimes(times: PrayerTimesData, nextPrayer: string | null, colorScheme: string | null | undefined) {
  const prayers = [
    { key: 'fajr', time: times.fajr },
    { key: 'sunrise', time: times.sunrise },
    { key: 'dhuhr', time: times.dhuhr },
    { key: 'asr', time: times.asr },
    { key: 'maghrib', time: times.maghrib },
    { key: 'isha', time: times.isha }
  ];
  
  return prayers.map(prayer => (
    <PrayerTimeRow 
      key={prayer.key}
      name={prayerArabicNames[prayer.key]}
      time={prayer.time} 
      icon={prayerIcons[prayer.key]}
      isNext={nextPrayer === prayer.key}
      colorScheme={colorScheme}
    />
  ));
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