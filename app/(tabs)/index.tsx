import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { cityMapping, egyptianGovernorates, getHeaderGradient, prayerArabicNames, prayerIcons } from '@/constants/prayerData';
import { useTheme } from '@/context/ThemeContext';
import { useTimeFormat } from '@/services/features/hours_types';
import { getPrayerTimes } from '@/services/prayerTimesService';
import { DateInfo, PrayerTimesData } from '@/types/prayerTimes';
import { determineNextPrayer } from '@/utils/prayerHelpers';
import NextPrayerTime from '../../services/features/nextPrayerTime';

export default function PrayerTimesScreen() {
  const [selectedCity, setSelectedCity] = useState<keyof typeof cityMapping>('القاهرة');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [dateInfo, setDateInfo] = useState<DateInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentDate] = useState('');
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  
  // إضافة حالة لعرض قائمة المحافظات
  const [isCityListVisible, setIsCityListVisible] = useState(false);
  // إضافة حالة لبحث المحافظات
  const [searchQuery, setSearchQuery] = useState('');
  // قائمة المحافظات المفلترة
  const filteredGovernates = egyptianGovernorates.filter(
    city => city.includes(searchQuery)
  );
  
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      try {
        const result = await getPrayerTimes(cityMapping[selectedCity]) as { timings: PrayerTimesData; date: DateInfo };
        setPrayerTimes(result.timings);
        setDateInfo(result.date);
        setNextPrayer(determineNextPrayer(result.timings));
        
        // لم نعد بحاجة للتاريخ المنسق محليًا، سنستخدم التاريخ من API
      } catch (error) {
        console.error('Failed to fetch prayer times:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrayerTimes();
  }, [selectedCity]);

  // تنسيق عرض التاريخ الهجري بالعربي
  const formatHijriDate = (date: DateInfo | null) => {
    if (!date) return '';
    const { day, month, year } = date.hijri;
    return `${day} ${month.ar} ${year}هـ`;
  };

  // تنسيق عرض التاريخ الميلادي بالعربي
  const formatGregorianDate = (date: DateInfo | null) => {
    if (!date) return '';
    const { day, month, year } = date.gregorian;
    
    // ترجمة أسماء الشهور للعربية
    const arabicMonths: Record<string, string> = {
      'January': 'يناير', 'February': 'فبراير', 'March': 'مارس',
      'April': 'أبريل', 'May': 'مايو', 'June': 'يونيو',
      'July': 'يوليو', 'August': 'أغسطس', 'September': 'سبتمبر',
      'October': 'أكتوبر', 'November': 'نوفمبر', 'December': 'ديسمبر'
    };
    
    return `${day} ${arabicMonths[month.en]} ${year}م`;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* رأس الصفحة */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={getHeaderGradient(isDarkMode)}
            style={styles.headerGradient}
          >
            <View style={styles.headerTopRow}>
              {dateInfo ? (
                <View style={styles.datesContainer}>
                  <ThemedText style={styles.hijriDate}>
                    {formatHijriDate(dateInfo)}
                  </ThemedText>
                  <ThemedText style={styles.gregorianDate}>
                    {formatGregorianDate(dateInfo)}
                  </ThemedText>
                </View>
              ) : (
                <ThemedText style={styles.dateText}>{currentDate}</ThemedText>
              )}
              
              {/* زر تبديل الوضع */}
              <TouchableOpacity 
                onPress={toggleTheme} 
                style={styles.themeToggleButton}
              >
                <MaterialCommunityIcons 
                  name={isDarkMode ? "weather-sunny" : "weather-night"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </View>
            
            <ThemedText style={styles.headerText}>مواقيت الصلاة</ThemedText>
            
            {/* زر اختيار المحافظة المحسن */}
            <TouchableOpacity 
              style={styles.citySelector} 
              onPress={() => setIsCityListVisible(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="map-marker" 
                size={24} 
                color="#FFFFFF" 
              />
              <ThemedText style={styles.cityText}>{selectedCity}</ThemedText>
              <MaterialCommunityIcons 
                name="chevron-down" 
                size={22} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        
        {/* محتوى الصفحة */}
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={isDarkMode ? "#64B5F6" : "#2196F3"} />
              <ThemedText style={styles.loadingText}>جاري تحميل مواقيت الصلاة...</ThemedText>
            </View>
          ) : prayerTimes ? (
            <>
              <NextPrayerTime 
                prayerTimes={prayerTimes}
                nextPrayer={nextPrayer}
                cityName={selectedCity}
              />
              
              <View style={styles.timesContainer}>
                {renderPrayerTimes(prayerTimes, nextPrayer, isDarkMode ? 'dark' : 'light')}
              </View>
            </>
          ) : (
            <ThemedText style={styles.noDataText}>لا توجد بيانات متاحة</ThemedText>
          )}
        </View>
        
        {/* مساحة إضافية في النهاية */}
        <View style={styles.bottomSpace} />
      </ScrollView>
      
      {/* نافذة اختيار المحافظة */}
      <Modal
        visible={isCityListVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCityListVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View 
            style={[
              styles.modalContainer, 
              { 
                backgroundColor: isDarkMode ? '#1D293E' : '#FFFFFF',
                borderColor: isDarkMode ? '#2C3E50' : '#E0E0E0' 
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>اختر المحافظة</ThemedText>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setIsCityListVisible(false)}
              >
                <MaterialCommunityIcons 
                  name="close" 
                  size={24} 
                  color={isDarkMode ? '#FFFFFF' : '#000000'} 
                />
              </TouchableOpacity>
            </View>
            
            {/* تحسين شكل حقل البحث */}
            <View 
              style={[
                styles.searchContainer, 
                { 
                  backgroundColor: isDarkMode ? '#2C3E50' : '#F5F5F5',
                  borderColor: isDarkMode ? '#3D5A80' : '#E0E0E0' 
                }
              ]}
            >
              <MaterialCommunityIcons 
                name="magnify" 
                size={20} 
                color={isDarkMode ? '#90CAF9' : '#757575'} 
                style={styles.searchIcon}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: isDarkMode ? '#FFFFFF' : '#000000' }
                ]}
                placeholder="بحث عن محافظة..."
                placeholderTextColor={isDarkMode ? '#7D8FA0' : '#9E9E9E'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                textAlign="right"
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <MaterialCommunityIcons 
                    name="close-circle" 
                    size={16} 
                    color={isDarkMode ? '#7D8FA0' : '#9E9E9E'} 
                  />
                </TouchableOpacity>
              )}
            </View>
            
            {/* تحسين عرض قائمة المحافظات */}
            <FlatList
              data={filteredGovernates}
              keyExtractor={(item) => item}
              style={styles.cityList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.cityItem, 
                    selectedCity === item && {
                      backgroundColor: isDarkMode ? 'rgba(77,100,141,0.3)' : 'rgba(3,169,244,0.1)'
                    }
                  ]}
                  onPress={() => {
                    setSelectedCity(item as keyof typeof cityMapping);
                    setIsCityListVisible(false);
                    setSearchQuery('');
                  }}
                >
                  <ThemedText 
                    style={[
                      styles.cityItemText,
                      { color: isDarkMode ? '#FFFFFF' : '#000000' },
                      selectedCity === item && { 
                        fontWeight: 'bold',
                        color: isDarkMode ? '#90CAF9' : '#1976D2' 
                      }
                    ]}
                  >
                    {item}
                  </ThemedText>
                  
                  {selectedCity === item && (
                    <MaterialCommunityIcons 
                      name="check" 
                      size={20} 
                      color={isDarkMode ? '#90CAF9' : '#1976D2'} 
                    />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyResultContainer}>
                  <MaterialCommunityIcons 
                    name="map-search-outline" 
                    size={40} 
                    color={isDarkMode ? '#5D7599' : '#BDBDBD'}
                  />
                  <ThemedText style={styles.emptyResultText}>
                    لا توجد محافظات تطابق البحث
                  </ThemedText>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
      
      <Image 
        source={require('@/assets/images/mosque_silhouette.png')} 
        style={[styles.backgroundImage, { opacity: isDarkMode ? 0.1 : 0.03 }]} 
        resizeMode="contain"
      />
    </SafeAreaView>
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
      
      <ThemedText style={[styles.prayerTime, { color: textColor }]}>{formatTime(time)}</ThemedText>
      
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
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    width: '100%',
  },
  headerGradient: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  themeToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '80%',
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cityText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  timesContainer: {
    width: '100%',
    paddingVertical: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
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
  },
  bottomSpace: {
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    maxHeight: '70%',
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    position: 'relative',
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    paddingRight: 8,
  },
  clearButton: {
    padding: 6,
  },
  cityList: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
    marginHorizontal: 4,
  },
  cityItemText: {
    fontSize: 16,
    fontWeight: '400',
  },
  emptyResultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyResultText: {
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
  hijriDate: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  gregorianDate: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 2,
  },
  datesContainer: {
    alignItems: 'center',
  },
});