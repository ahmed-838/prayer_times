import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          title: "عن التطبيق",
          headerTitleAlign: 'center',
        }}
      />
      
      <ThemedView style={styles.content}>
        <MaterialIcons name="access-time" size={80} color={themeColors.tint} style={styles.logo} />
        
        <ThemedText style={styles.title}>تطبيق مواقيت الصلاة</ThemedText>
        
        <ThemedText style={styles.version}>الإصدار 1.0.0</ThemedText>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>نبذة عن التطبيق</ThemedText>
          <ThemedText style={styles.sectionContent}>
            تطبيق مواقيت الصلاة يساعد المسلمين على معرفة أوقات الصلوات الخمس بدقة عالية. 
            يعتمد التطبيق على حسابات فلكية دقيقة ويوفر تنبيهات للصلوات.
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>المطور</ThemedText>
          <ThemedText style={styles.sectionContent}>
            تم تطوير هذا التطبيق بواسطة فريق مختص في تطوير تطبيقات الجوال.
            نسعى دائمًا لتقديم أفضل تجربة مستخدم ممكنة.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: 'rtl',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  version: {
    fontSize: 16,
    marginBottom: 30,
    opacity: 0.7,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right',
  },
});
