import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Switch } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTimeFormat } from '@/services/features/hours_types';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoLocation, setAutoLocation] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { use24HourFormat, toggleTimeFormat } = useTimeFormat();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerText}>الإعدادات</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
        <SettingRow 
          title="تفعيل الإشعارات" 
          icon="notifications"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          themeColors={themeColors}
        />
        
        <SettingRow 
          title="استخدام نظام 24 ساعة" 
          icon="access-time"
          value={use24HourFormat}
          onValueChange={toggleTimeFormat}
          themeColors={themeColors}
        />
        
        <SettingRow 
          title="تحديد الموقع تلقائيًا" 
          icon="location-on"
          value={autoLocation}
          onValueChange={setAutoLocation}
          themeColors={themeColors}
          isLast={true}
        />
      </ThemedView>
      
      <ThemedView style={[styles.card, { backgroundColor: themeColors.cardBackground, marginTop: 20 }]}>
        <ThemedView style={styles.aboutRow}>
          <MaterialIcons name="info" size={24} color={themeColors.tint} style={styles.aboutIcon} />
          <ThemedText style={styles.aboutText}>عن التطبيق</ThemedText>
        </ThemedView>
        
        <ThemedView style={[styles.divider, { borderBottomColor: themeColors.border }]} />
        
        <ThemedView style={styles.aboutRow}>
          <MaterialIcons name="help" size={24} color={themeColors.tint} style={styles.aboutIcon} />
          <ThemedText style={styles.aboutText}>المساعدة والدعم</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.infoSection}>
        <ThemedText style={styles.versionText}>الإصدار 1.0.0</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

// Define the interface for theme colors
interface ThemeColors {
  tint: string;
  border: string;
  cardBackground: string;
  switchTrackOff: string;
  switchThumbOn: string;
  switchThumbOff: string;
  text: string;
  background: string;
  tabIconDefault: string;
  tabIconSelected: string;
  headerGradient: string[];
  cardGradient: string[];
  highlightBackground: string;
  highlightText: string;
  [key: string]: string | string[] | Record<string, string>;  // Allow string arrays and objects too
}

// Define the interface for SettingRow props
interface SettingRowProps {
  title: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name']; // Use the correct icon type
  value: boolean;
  onValueChange: (value: boolean) => void;
  themeColors: ThemeColors;
  isLast?: boolean;
}

function SettingRow({ title, icon, value, onValueChange, themeColors, isLast = false }: SettingRowProps) {
  return (
    <>
      <ThemedView style={styles.settingRow}>
        <ThemedView style={styles.settingTitleContainer}>
          <MaterialIcons name={icon} size={24} color={themeColors.tint} style={styles.settingIcon} />
          <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        </ThemedView>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: themeColors.switchTrackOff, true: themeColors.tint }}
          thumbColor={value ? themeColors.switchThumbOn : themeColors.switchThumbOff}
          ios_backgroundColor={themeColors.switchTrackOff}
        />
      </ThemedView>
      {!isLast && <ThemedView style={[styles.divider, { borderBottomColor: themeColors.border }]} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    direction: 'rtl', // RTL support
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginLeft: 12, // RTL support
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 4,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  aboutIcon: {
    marginLeft: 12, // RTL support
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoSection: {
    marginTop: 'auto',
    alignItems: 'center',
    padding: 16,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
