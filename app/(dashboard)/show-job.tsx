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

  // Params වලින් දත්ත ලබා ගැනීම
  const { id, title, company, salary, description, imageUrl, postedBy } = params;

  const currentUser = auth.currentUser;
  
  // recruiterId එක undefined වීම වැළැක්වීමට safe string එකක් ලෙස ගැනීම
  const recruiterIdStr = (postedBy as string) || "";
  const isOwner = currentUser?.uid === recruiterIdStr;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (e) {
          console.error("Role fetch error:", e);
        }
      }
    };
    fetchUserRole();
  }, [currentUser]);

  // අයිතිකරුට හෝ Admin ට විශේෂ අවසර (View Applications බටන් එක පෙන්වීමට)
  const isPrivileged = isOwner || userRole === "admin";

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setSelectedCV(result.assets[0]);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleApply = async () => {
    if (!currentUser) return Alert.alert("Error", "Please login first.");
    if (!selectedCV) return Alert.alert("Error", "Please select a CV.");
    
    // වැදගත්: recruiterId එක නැත්නම් apply කිරීම නැවැත්වීම
    if (!recruiterIdStr) {
      return Alert.alert("Error", "Recruiter information is missing for this job.");
    }

    setIsApplying(true);
    try {
      // 1. CV එක Cloudinary වෙත upload කිරීම
      const cvUrl = await uploadCV(selectedCV.uri, selectedCV.name);
      
      // 2. Job එකට Apply කිරීම (දැන් applicantId ද ඇතුළත් වේ)
      await applyForJob({
        jobId: id as string,
        jobTitle: title as string,
        companyName: company as string,
        applicantEmail: currentUser.email,
        applicantName: currentUser.displayName || "User",
        applicantId: currentUser.uid, // <--- TypeScript error එක මෙතැනින් විසඳේ
        cvUrl: cvUrl,
        status: "Pending",
        recruiterId: recruiterIdStr,
      });

      Alert.alert("Success", "Application sent successfully!");
      router.back();
    } catch (error: any) {
      console.error("Apply Error:", error);
      Alert.alert("Error", "Application failed. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- Header Section --- */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>

        {isPrivileged ? (
          <TouchableOpacity 
            style={styles.viewAppsBtn} 
            onPress={() => router.push({ pathname: "/view-applications", params: { jobId: id } })}
          >
            <Ionicons name="people-outline" size={20} color="#fff" />
            <Text style={styles.viewAppsText}>Applications</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.topApplyBtn, (isApplying || !selectedCV) && styles.disabledBtn]} 
            onPress={handleApply}
            disabled={isApplying || !selectedCV}
          >
            {isApplying ? <ActivityIndicator color="#fff" /> : <Text style={styles.topApplyBtnText}>Apply Now</Text>}
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Banner Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: (imageUrl as string) || 'https://via.placeholder.com/800x400' }} 
            style={styles.bannerImage} 
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.companyRow}>
            <Ionicons name="business-outline" size={20} color="#64748B" />
            <Text style={styles.companyName}>{company}</Text>
          </View>
          
          <View style={styles.salaryBadge}>
            <Text style={styles.salaryText}>💰 LKR {salary} / Month</Text>
          </View>

          <View style={styles.divider} />

          {/* CV Picker Section (Hide for Admin/Owner) */}
          {!isPrivileged && (
            <View>
              <Text style={styles.sectionTitle}>Attach Your CV</Text>
              <TouchableOpacity 
                style={[styles.cvPicker, selectedCV && styles.cvSelected]} 
                onPress={pickDocument}
              >
                <Ionicons 
                  name={selectedCV ? "checkmark-circle" : "document-attach-outline"} 
                  size={24} 
                  color={selectedCV ? "#10B981" : "#007AFF"} 
                />
                <Text style={[styles.cvPickerText, selectedCV && { color: "#10B981" }]}>
                  {selectedCV ? selectedCV.name : "Select PDF CV"}
                </Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
          )}

          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 110,
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15, zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  iconBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 12 },
  viewAppsBtn: {
    backgroundColor: "#10B981", flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, gap: 8
  },
  viewAppsText: { color: "#fff", fontWeight: "bold" },
  topApplyBtn: { backgroundColor: "#007AFF", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  topApplyBtnText: { color: "#fff", fontWeight: "bold" },
  disabledBtn: { backgroundColor: "#CBD5E1" },
  scrollPadding: { paddingTop: 110, paddingBottom: 40 },
  imageContainer: { width: "100%", height: 230 },
  bannerImage: { width: "100%", height: "100%" },
  content: { padding: 25 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1E293B" },
  companyRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  companyName: { fontSize: 17, color: "#64748B", marginLeft: 8 },
  salaryBadge: { backgroundColor: "#E0F2FE", padding: 10, borderRadius: 10, alignSelf: "flex-start", marginTop: 10 },
  salaryText: { color: "#007AFF", fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  descriptionText: { fontSize: 15, color: "#475569", lineHeight: 24 },
  cvPicker: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderWidth: 1.5, borderColor: '#007AFF', borderStyle: 'dashed', borderRadius: 15,
  },
  cvSelected: { borderColor: '#10B981', backgroundColor: '#F0FDF4', borderStyle: 'solid' },
  cvPickerText: { marginLeft: 10, fontSize: 16, color: '#007AFF', fontWeight: '600' },
});