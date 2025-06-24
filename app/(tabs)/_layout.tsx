import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'مواقيت الصلاة',
          // استخدام أيقونة الساعة لمواقيت الصلاة
          tabBarIcon: ({ color, size }) => 
            <MaterialCommunityIcons name="clock-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',
          // استخدام أيقونة الترس للإعدادات
          tabBarIcon: ({ color, size }) => 
            <MaterialCommunityIcons name="cog-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
