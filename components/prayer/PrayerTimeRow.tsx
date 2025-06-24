import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

interface PrayerTimeRowProps {
  name: string;
  time: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  isNext: boolean;
  colorScheme: string | null | undefined;
}

export function PrayerTimeRow({ name, time, icon, isNext, colorScheme }: PrayerTimeRowProps) {
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
      
      {/* Prayer time */}
      <ThemedText style={[styles.prayerTime, { color: textColor }]}>{time}</ThemedText>
      
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

const styles = StyleSheet.create({
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
});
