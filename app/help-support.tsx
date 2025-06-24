import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HelpSupportScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          title: "المساعدة والدعم",
          headerTitleAlign: 'center',
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.content}>
          <MaterialIcons name="help-outline" size={60} color={themeColors.tint} style={styles.icon} />
          
          <ThemedText style={styles.title}>المساعدة والدعم</ThemedText>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>الأسئلة الشائعة</ThemedText>
            
            <ThemedView style={styles.questionBox}>
              <ThemedText style={styles.question}>كيف يتم حساب مواقيت الصلاة؟</ThemedText>
              <ThemedText style={styles.answer}>
                يعتمد التطبيق على حسابات فلكية دقيقة تأخذ بعين الاعتبار الموقع الجغرافي والمنطقة الزمنية وفق طرق حساب معتمدة من هيئات إسلامية معتبرة.
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.questionBox}>
              <ThemedText style={styles.question}>كيف يمكنني تغيير طريقة الحساب؟</ThemedText>
              <ThemedText style={styles.answer}>
                يمكنك الانتقال إلى إعدادات التطبيق واختيار طريقة الحساب المناسبة لمنطقتك.
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.questionBox}>
              <ThemedText style={styles.question}>كيف يمكنني تفعيل الإشعارات؟</ThemedText>
              <ThemedText style={styles.answer}>
                سيتم إضافة ميزة الإشعارات قريبًا في تحديثات التطبيق القادمة.
              </ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>التواصل معنا</ThemedText>
            <ThemedText style={styles.contactInfo}>
                Email :{'\n'}
               ashams3719262@gmail.com{'\n'}
              Phone :
               {'\n'}
               01224900205
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
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
  },
  icon: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  questionBox: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
  },
  contactInfo: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right',
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
