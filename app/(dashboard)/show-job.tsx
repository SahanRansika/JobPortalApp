import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { applyForJob } from "../../services/jobService";
import { auth } from "../../services/firebase";

const { width } = Dimensions.get("window");

export default function JobDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isApplying, setIsApplying] = useState(false);

  // Params හරහා එන දත්ත ලබා ගැනීම
  const { id, title, company, salary, description, imageUrl } = params;

  // --- Apply Logic ---
  const handleApply = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Login Required", "Please login to apply for this job.");
      return;
    }

    Alert.alert(
      "Confirm Application",
      `Do you want to apply for the ${title} position at ${company}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Apply",
          onPress: async () => {
            setIsApplying(true);
            try {
              await applyForJob({
                jobId: id,
                jobTitle: title,
                companyName: company,
                applicantEmail: user.email,
                applicantName: user.displayName || user.email?.split('@')[0],
                status: "Pending",
              });
              Alert.alert("Success!", "Your application has been submitted.");
            } catch (error) {
              Alert.alert("Error", "Failed to submit application. Try again.");
            } finally {
              setIsApplying(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- Job Banner Image --- */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: (imageUrl as string) || 'https://via.placeholder.com/800x400' }} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* --- Job Title & Company --- */}
          <Text style={styles.title}>{title}</Text>
          <View style={styles.companyRow}>
            <Ionicons name="business-outline" size={20} color="#64748B" />
            <Text style={styles.companyName}>{company}</Text>
          </View>

          {/* --- Salary Badge --- */}
          <View style={styles.salaryBadge}>
            <Text style={styles.salaryText}>💰 LKR {salary} / Month</Text>
          </View>

          <View style={styles.divider} />

          {/* --- Description --- */}
          <Text style={styles.sectionTitle}>About the Role</Text>
          <Text style={styles.descriptionText}>
            {description || "Detailed description not available for this role."}
          </Text>

          {/* --- Quick Info --- */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Ionicons name="briefcase-outline" size={22} color="#007AFF" />
              <Text style={styles.infoLabel}>Job Type</Text>
              <Text style={styles.infoValue}>Full-time</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="globe-outline" size={22} color="#007AFF" />
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>Remote / SL</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* --- Bottom Footer with Apply Button --- */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.applyBtn, isApplying && styles.disabledBtn]} 
          onPress={handleApply}
          disabled={isApplying}
        >
          {isApplying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.applyBtnText}>Apply Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  imageContainer: { width: "100%", height: 260, position: "relative" },
  bannerImage: { width: "100%", height: "100%" },
  backButton: { 
    position: "absolute", 
    top: 50, 
    left: 20, 
    backgroundColor: "rgba(0,0,0,0.4)", 
    padding: 10, 
    borderRadius: 25 
  },
  content: { 
    padding: 25, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    marginTop: -35, 
    backgroundColor: "#fff",
    minHeight: 500 
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#0F172A", marginBottom: 10 },
  companyRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  companyName: { fontSize: 17, color: "#64748B", marginLeft: 8, fontWeight: "500" },
  salaryBadge: { 
    backgroundColor: "#E0F2FE", 
    paddingHorizontal: 18, 
    paddingVertical: 12, 
    borderRadius: 14, 
    alignSelf: "flex-start",
    marginBottom: 25
  },
  salaryText: { color: "#007AFF", fontWeight: "bold", fontSize: 17 },
  divider: { height: 1.5, backgroundColor: "#F1F5F9", marginBottom: 25 },
  sectionTitle: { fontSize: 19, fontWeight: "bold", color: "#1E293B", marginBottom: 12 },
  descriptionText: { fontSize: 15, color: "#475569", lineHeight: 25, marginBottom: 25 },
  infoGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 120 },
  infoCard: { 
    backgroundColor: "#F8FAFC", 
    width: (width - 70) / 2, 
    padding: 20, 
    borderRadius: 20, 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  infoLabel: { fontSize: 12, color: "#94A3B8", marginTop: 8 },
  infoValue: { fontSize: 15, fontWeight: "bold", color: "#1E293B", marginTop: 4 },
  footer: { 
    position: "absolute", 
    bottom: 0, 
    width: "100%", 
    padding: 20, 
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingBottom: Platform.OS === 'ios' ? 40 : 20
  },
  applyBtn: { 
    backgroundColor: "#007AFF", 
    paddingVertical: 18, 
    borderRadius: 16, 
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  disabledBtn: { backgroundColor: "#94A3B8" },
  applyBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});