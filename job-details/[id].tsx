import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function JobDetails() {
  const { id, title } = useLocalSearchParams(); // Home එකෙන් එවන data

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title || "Job Title"}</Text>
        <Text style={styles.company}>Tech Solutions Inc.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Description</Text>
        <Text style={styles.description}>
          We are looking for a skilled developer to join our team. 
          You will be responsible for building high-quality mobile applications...
        </Text>
      </View>

      <TouchableOpacity style={styles.applyNowBtn}>
        <Text style={styles.applyNowText}>Confirm Application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { marginBottom: 25 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  company: { fontSize: 18, color: '#007AFF', marginTop: 5 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { lineHeight: 22, color: '#475569' },
  applyNowBtn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center' },
  applyNowText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});