import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface Prayer {
  name: string;
  time: string;
  arabicName: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

export type CityMap = Record<string, string>;
export type IconMap = Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']>;
