import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

// مفتاح لتخزين وضع الألوان المفضل
const THEME_PREFERENCE_KEY = 'user_theme_preference';
type ColorSchemeType = 'light' | 'dark' | null | undefined;

export function useColorScheme() {
  // الوضع الأولي هو وضع النظام
  const systemColorScheme = Appearance.getColorScheme();
  
  // حالة لتخزين التفضيل الذي تم اختياره
  const [colorScheme, setColorScheme] = useState<ColorSchemeType>(systemColorScheme);

  // تحميل التفضيل المحفوظ عند البدء
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedTheme) {
          setColorScheme(savedTheme as ColorSchemeType);
        }
      } catch (error) {
        console.error('خطأ في تحميل تفضيل الوضع المظلم:', error);
      }
    };
    
    loadSavedTheme();
  }, []);

  // الاستماع إلى تغييرات وضع النظام - سيتم تجاهله إذا كان المستخدم قد حدد تفضيلًا
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      // تحديث الوضع فقط إذا لم يكن هناك تفضيل محدد من المستخدم
      AsyncStorage.getItem(THEME_PREFERENCE_KEY).then(savedTheme => {
        if (!savedTheme) {
          setColorScheme(newColorScheme);
        }
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // دالة لضبط وضع الألوان يدويًا
  const setUserColorScheme = async (theme: ColorSchemeType) => {
    try {
      if (theme) {
        await AsyncStorage.setItem(THEME_PREFERENCE_KEY, theme);
      } else {
        // إذا كانت القيمة فارغة، نستخدم وضع النظام ونزيل التفضيل
        await AsyncStorage.removeItem(THEME_PREFERENCE_KEY);
      }
      setColorScheme(theme || Appearance.getColorScheme());
    } catch (error) {
      console.error('خطأ في حفظ تفضيل الوضع المظلم:', error);
    }
  };

  return {
    colorScheme,
    setColorScheme: setUserColorScheme,
    isSystemDefault: !AsyncStorage.getItem(THEME_PREFERENCE_KEY)
  };
}
