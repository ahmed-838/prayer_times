import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface DateInfo {
  readable: string;
  timestamp: string;
  gregorian: {
    date: string;
    format: string;
    day: string;
    weekday: {
      en: string;
    };
    month: {
      number: number;
      en: string;
    };
    year: string;
  };
  hijri: {
    date: string;
    format: string;
    day: string;
    weekday: {
      en: string;
      ar: string;
    };
    month: {
      number: number;
      en: string;
      ar: string;
    };
    year: string;
  };
}

export interface PrayerTimesResponse {
  timings: PrayerTimesData;
  date: DateInfo;
}

export interface Prayer {
  name: string;
  time: string;
  arabicName: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

export type CityMap = Record<string, string>;
export type IconMap = Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']>;
