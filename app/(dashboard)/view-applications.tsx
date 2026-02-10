import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, 
  Linking, ActivityIndicator, Platform, Alert, SafeAreaView 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getApplicationsForJob, updateApplicationStatus } from "../../services/jobService";

export default function ViewApplications() {
  const { jobId } = useLocalSearchParams();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. අයදුම්පත් දත්ත ලබා ගැනීම
  const fetchApps = async () => {
    setLoading(true);
    if (jobId) {
      const data = await getApplicationsForJob(jobId as string);
      setApplications(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, [jobId]);

  // 2. CV එක Browser එකේ විවෘත කිරීම
  const openCV = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert("Error", "Cannot open CV link"));
  };

  // 3. Email එක සූදානම් කිරීමේ Function එක
  const sendApprovalEmail = (email: string, name: string, jobTitle: string) => {
    const subject = encodeURIComponent(`Good News! Your application for ${jobTitle}`);
    const body = encodeURIComponent(
      `Hi ${name},\n\n` +
      `Congratulations! 🎉 We have reviewed your application for the ${jobTitle} position and we are pleased to inform you that you have been SELECTED.\n\n` +
      `We were impressed with your profile and would like to proceed with the next steps. Our team will contact you shortly for an interview.\n\n` +
      `Best Regards,\n` +
      `Recruitment Team`
    );

    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    
    Linking.openURL(url).catch(() => 
      Alert.alert("Error", "Could not open email app. Please send manually to: " + email)
    );
  };

  // 4. Status එක Update කිරීම (Approve/Reject)
  const handleStatusUpdate = async (item: any, status: "Approved" | "Rejected") => {
    try {
      await updateApplicationStatus(item.id, status);
      
      if (status === "Approved") {
        Alert.alert(
          "Application Approved 🎉",
          "The candidate has been approved. Do you want to send the selection email now?",
          [
            { text: "Later", style: "cancel", onPress: () => fetchApps() },
            { 
              text: "Send Email", 
              onPress: () => {
                fetchApps();
                sendApprovalEmail(item.applicantEmail, item.applicantName, item.jobTitle);
              } 
            }
          ]
        );
      } else {
        Alert.alert("Success", "Application Rejected.");
        fetchApps();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.applicantName}</Text>
          <Text style={styles.email}>{item.applicantEmail}</Text>
        </View>
      </View>

      <Text style={styles.date}>Applied on: {new Date(item.appliedAt).toLocaleDateString()}</Text>

      <TouchableOpacity style={styles.cvBtn} onPress={() => openCV(item.cvUrl)}>
        <Ionicons name="document-text-outline" size={20} color="#007AFF" />
        <Text style={styles.cvBtnText}>View Applicant CV (PDF)</Text>
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.rejectBtn]} 
          onPress={() => handleStatusUpdate(item, "Rejected")}
        >
          <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, styles.approveBtn]} 
          onPress={() => handleStatusUpdate(item, "Approved")}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Applications</Text>
          <Text style={styles.headerSubtitle}>Manage your candidates</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="file-tray-outline" size={80} color="#CBD5E1" />
              <Text style={styles.emptyText}>No applications received yet.</Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { 
    flexDirection: 'row', alignItems: 'center', 
    padding: 20, backgroundColor: '#fff', 
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    paddingTop: Platform.OS === 'android' ? 40 : 20
  },
  backBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 12, marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  headerSubtitle: { fontSize: 13, color: '#64748B' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listPadding: { padding: 20, paddingBottom: 100 },
  card: { 
    backgroundColor: '#fff', borderRadius: 20, padding: 20, 
    marginBottom: 16, elevation: 4, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 12, borderWidth: 1, borderColor: '#F1F5F9'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  email: { color: '#64748B', marginTop: 2, fontSize: 14 },
  date: { fontSize: 12, color: '#94A3B8', marginTop: 12, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '800', color: '#fff', textTransform: 'uppercase' },
  bgOrange: { backgroundColor: '#F59E0B' },
  bgGreen: { backgroundColor: '#10B981' },
  bgRed: { backgroundColor: '#EF4444' },
  cvBtn: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F7FF', 
    padding: 14, borderRadius: 14, marginTop: 18, borderStyle: 'dashed',
    borderWidth: 1.5, borderColor: '#007AFF'
  },
  cvBtnText: { color: '#007AFF', fontWeight: '700', marginLeft: 10 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionBtn: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 14, borderWidth: 1.5
  },
  approveBtn: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  rejectBtn: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  approveText: { color: '#10B981', fontWeight: '800', marginLeft: 6 },
  rejectText: { color: '#EF4444', fontWeight: '800', marginLeft: 6 },
  emptyContainer: { alignItems: 'center', marginTop: 120 },
  emptyText: { color: '#94A3B8', marginTop: 15, fontSize: 16, fontWeight: '500' }
});