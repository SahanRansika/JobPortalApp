import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signOut } from "firebase/auth";
import React from 'react';
import {
  Alert, Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { auth } from "../../services/firebase";

interface ProfileProps {
  navigation: NativeStackNavigationProp<any>;
}

const { width } = Dimensions.get('window');

export default function Profile({ navigation }: ProfileProps) {
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout from CareerConnect?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('Login'); 
            } catch (error) {
              Alert.alert("Error", "Logout failed.");
            }
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header Section with Background Image */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174' }} 
        style={styles.headerBackground}
        borderBottomLeftRadius={40}
        borderBottomRightRadius={40}
      >
        {/* Overlay - අකුරු පැහැදිලිව පෙනීමට */}
        <View style={styles.overlay}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>
            {auth.currentUser?.displayName || "Job Seeker"}
          </Text>
          <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
          
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
      </ImageBackground>

      {/* Settings Options Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity style={styles.infoRow} onPress={() => navigation.navigate('EditProfile')}>
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

        <TouchableOpacity style={styles.infoRow}>
          <View style={[styles.iconBackground, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="notifications-outline" size={22} color="#FF9800" />
          </View>
          <Text style={styles.infoText}>Job Notifications</Text>
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
  headerBackground: { 
    width: '100%', 
    height: 320, 
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 122, 255, 0.7)', // Blue tint with transparency
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileImageContainer: { position: 'relative' },
  profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#fff' },
  editIcon: { 
    position: 'absolute', 
    bottom: 0, 
    right: 5, 
    backgroundColor: '#34C759', 
    padding: 7, 
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff'
  },userEmail: { fontSize: 14, color: '#f0f0f0', marginTop: 2, opacity: 0.9 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  
  
  statsContainer: { 
    flexDirection: 'row', 
    marginTop: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 15, 
    padding: 12,
    width: width * 0.75
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#fff', fontSize: 11, opacity: 0.9 },
  statDivider: { width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.3)' },

  infoSection: { padding: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', marginBottom: 15, textTransform: 'uppercase' },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 18, 
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBackground: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  infoText: { flex: 1, marginLeft: 15, fontSize: 15, color: '#333', fontWeight: '600' },
  
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
  
  logoutButton: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFF0F0',
    padding: 16, 
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFD2D2'
  },
  logoutText: { color: '#FF3B30', fontWeight: 'bold', marginLeft: 10, fontSize: 15 },
  versionText: { textAlign: 'center', color: '#bbb', marginVertical: 20, fontSize: 11 }
});