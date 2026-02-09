import { Ionicons } from '@expo/vector-icons';
import { signOut, updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { auth } from "../../services/firebase";

const { width } = Dimensions.get('window');

export default function Profile() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  
  // දැනට ඇති photo එක හෝ default අයිකනයක් පෙන්වීමට
  const [profilePic, setProfilePic] = useState(
    auth.currentUser?.photoURL || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  );

  // Gallery එකෙන් image එකක් තෝරාගන්නා ආකාරය
  const pickImage = async () => {
    // Phone එකෙන් අවසර ඉල්ලීම
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // රූපය කපා ගැනීමට (Crop) ඉඩ දීම
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      handleImageUpdate(result.assets[0].uri);
    }
  };

  // Firebase profile එකට අලුත් image එක update කිරීම
  const handleImageUpdate = async (uri: string) => {
    setUploading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // Firebase Auth එකට image URL එක ඇතුළත් කිරීම
        await updateProfile(user, { photoURL: uri });
        setProfilePic(uri);
        Alert.alert("Success", "Profile picture updated locally!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile image.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getUserName = () => {
    const user = auth.currentUser;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return "Job Seeker";
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        onPress: () => signOut(auth).then(() => router.replace("/login" as any)) 
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Blue Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profilePic }} style={styles.profileImage} />
          
          {/* කැමරා අයිකනය (Image Picker එකට සම්බන්ධ කර ඇත) */}
          <TouchableOpacity 
            style={styles.editIcon} 
            onPress={pickImage} 
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="camera" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{getUserName()}</Text>
        <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Applied</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>05</Text>
            <Text style={styles.statLabel}>Interviews</Text>
          </View>
        </View>
      </View>

      {/* Account Settings Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity style={styles.infoRow} onPress={() => router.push("/edit-profile" as any)}>
          <View style={[styles.iconBackground, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="person-outline" size={22} color="#007AFF" />
          </View>
          <Text style={styles.infoText}>Edit Profile Information</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoRow}>
          <View style={[styles.iconBackground, { backgroundColor: '#E1F5FE' }]}>
            <Ionicons name="document-text-outline" size={22} color="#03A9F4" />
          </View>
          <Text style={styles.infoText}>My Resume / CV</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Sign Out Account</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>CareerConnect Pro • v1.0.2</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd' },
  headerContainer: {
    backgroundColor: '#0050FF', 
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileImageContainer: { position: 'relative' },
  profileImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 4, 
    borderColor: '#fff' 
  },
  editIcon: { 
    position: 'absolute', 
    bottom: 5, 
    right: 5, 
    backgroundColor: '#34C759', 
    padding: 8, 
    borderRadius: 20, 
    borderWidth: 3, 
    borderColor: '#fff',
    elevation: 5
  },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 15 },
  userEmail: { fontSize: 14, color: '#f0f0f0', opacity: 0.8 },
  statsContainer: { 
    flexDirection: 'row', 
    marginTop: 25, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 20, 
    padding: 15, 
    width: width * 0.8 
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#fff', fontSize: 12 },
  statDivider: { width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.3)' },
  infoSection: { padding: 25 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#999', marginBottom: 15, textTransform: 'uppercase' },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 18, 
    marginBottom: 12, 
    elevation: 2 
  },
  iconBackground: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  infoText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
  logoutButton: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFF0F0', 
    padding: 18, 
    borderRadius: 18, 
    marginTop: 10 
  },
  logoutText: { color: '#FF3B30', fontWeight: 'bold', marginLeft: 10 },
  versionText: { textAlign: 'center', color: '#bbb', marginVertical: 20, fontSize: 11 }
});