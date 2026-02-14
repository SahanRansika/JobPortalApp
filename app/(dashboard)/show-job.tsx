import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { 
  Image, ScrollView, StyleSheet, Text, TouchableOpacity, 
  View, Alert, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { applyForJob, uploadCV } from "../../services/jobService";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function JobDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isApplying, setIsApplying] = useState(false);
  const [selectedCV, setSelectedCV] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");

  const { id, title, company, salary, description, imageUrl, postedBy } = params;
  const currentUser = auth.currentUser;
  const recruiterIdStr = (postedBy as string) || "";
  const isOwner = currentUser?.uid === recruiterIdStr;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) setUserRole(userDoc.data().role);
        } catch (e) { console.error(e); }
      }
    };
    fetchUserRole();
  }, [currentUser]);

  const isPrivileged = isOwner || userRole === "admin";

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
      if (!result.canceled) setSelectedCV(result.assets[0]);
    } catch (err) { Alert.alert("Error", "Failed to pick document"); }
  };

  const handleApply = async () => {
    if (!currentUser) return Alert.alert("Error", "Please login first.");
    if (!selectedCV) return Alert.alert("Error", "Please select a CV.");
    
    setIsApplying(true);
    try {
      const cvUrl = await uploadCV(selectedCV.uri, selectedCV.name);
      await applyForJob({
        jobId: id as string,
        jobTitle: title as string,
        companyName: company as string,
        applicantEmail: currentUser.email,
        applicantName: currentUser.displayName || "User",
        applicantId: currentUser.uid,
        cvUrl: cvUrl,
        status: "Pending",
        recruiterId: recruiterIdStr,
      });
      Alert.alert("Success", "Application sent successfully!");
      router.back();
    } catch (error) { Alert.alert("Error", "Application failed."); }
    finally { setIsApplying(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        {isPrivileged ? (
          <TouchableOpacity style={styles.viewAppsBtn} onPress={() => router.push({ pathname: "/view-applications", params: { jobId: id } })}>
            <Text style={styles.viewAppsText}>Applications</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.topApplyBtn, (isApplying || !selectedCV) && styles.disabledBtn]} onPress={handleApply} disabled={isApplying || !selectedCV}>
            {isApplying ? <ActivityIndicator color="#fff" /> : <Text style={styles.topApplyBtnText}>Apply Now</Text>}
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollPadding}>
        <Image source={{ uri: (imageUrl as string) || 'https://via.placeholder.com/800x400' }} style={styles.bannerImage} />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.companyName}>{company}</Text>
          <View style={styles.salaryBadge}><Text style={styles.salaryText}>💰 LKR {salary}</Text></View>
          <View style={styles.divider} />
          {!isPrivileged && (
            <TouchableOpacity style={[styles.cvPicker, selectedCV && styles.cvSelected]} onPress={pickDocument}>
              <Text style={styles.cvPickerText}>{selectedCV ? selectedCV.name : "Select PDF CV"}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topHeader: { height: 110, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  iconBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 12 },
  viewAppsBtn: { backgroundColor: "#10B981", padding: 10, borderRadius: 12 },
  viewAppsText: { color: "#fff", fontWeight: "bold" },
  topApplyBtn: { backgroundColor: "#007AFF", padding: 10, borderRadius: 12 },
  topApplyBtnText: { color: "#fff", fontWeight: "bold" },
  disabledBtn: { backgroundColor: "#CBD5E1" },
  scrollPadding: { paddingBottom: 40 },
  bannerImage: { width: "100%", height: 230 },
  content: { padding: 25 },
  title: { fontSize: 24, fontWeight: "bold" },
  companyName: { fontSize: 17, color: "#64748B" },
  salaryBadge: { backgroundColor: "#E0F2FE", padding: 8, borderRadius: 10, marginTop: 10, alignSelf: 'flex-start' },
  salaryText: { color: "#007AFF", fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 20 },
  cvPicker: { padding: 15, borderWidth: 1.5, borderColor: '#007AFF', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center' },
  cvSelected: { borderColor: '#10B981', backgroundColor: '#F0FDF4', borderStyle: 'solid' },
  cvPickerText: { color: '#007AFF', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  descriptionText: { fontSize: 15, color: "#475569", lineHeight: 24, marginTop: 10 },
});