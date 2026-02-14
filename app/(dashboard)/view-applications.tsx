import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getApplicationsForJob, updateApplicationStatus } from "../../services/jobService";

export default function ViewApplications() {
  const { jobId } = useLocalSearchParams();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    try {
      if (jobId) {
        const data = await getApplicationsForJob(jobId as string);
        setApplications(data);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, [jobId]);

  const openCV = async (url: string) => {
    if (!url) return Alert.alert("Error", "CV URL not found.");
    try {
      await Linking.openURL(url);
    } catch (error) { Alert.alert("Error", "Failed to open PDF."); }
  };

  const handleStatusUpdate = async (item: any, status: "Approved" | "Rejected") => {
    try {
      await updateApplicationStatus(item.id, status);
      Alert.alert("Success", `Application ${status}`);
      fetchApps();
    } catch (error) { Alert.alert("Error", "Update failed."); }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.applicantName}</Text>
      <Text style={styles.email}>{item.applicantEmail}</Text>
      <TouchableOpacity style={styles.cvBtn} onPress={() => openCV(item.cvUrl)}>
        <Ionicons name="document-text" size={20} color="#007AFF" />
        <Text style={styles.cvBtnText}>View CV (PDF)</Text>
      </TouchableOpacity>
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleStatusUpdate(item, "Rejected")}>
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleStatusUpdate(item, "Approved")}>
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Applications</Text>
      </View>
      {loading ? <ActivityIndicator size="large" style={{flex:1}} /> : 
        <FlatList data={applications} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={{padding: 20}} />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: 'row', padding: 20, alignItems: 'center', gap: 15, backgroundColor: '#fff' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
  name: { fontSize: 17, fontWeight: 'bold' },
  email: { color: '#64748B' },
  cvBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 10, padding: 10, backgroundColor: '#F0F9FF', borderRadius: 10 },
  cvBtnText: { color: '#007AFF', marginLeft: 8, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  actionBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  approveBtn: { backgroundColor: '#F0FDF4' },
  rejectBtn: { backgroundColor: '#FEF2F2' },
  approveText: { color: '#10B981', fontWeight: 'bold' },
  rejectText: { color: '#EF4444', fontWeight: 'bold' },
});