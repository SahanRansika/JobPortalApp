import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getJobs } from "../../services/jobService";
import { push } from "expo-router/build/global-state/routing";
import { auth } from "@/services/firebase";

const { width } = Dimensions.get('window');
const isTablet = width > 768;


export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      
      {/* --- 1. Top Navigation Bar --- */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1063/1063376.png' }} 
            style={styles.logo}
          />
          <Text style={styles.brandName}>JobPortal</Text>
        </View>

        <View style={styles.navRight}>
           <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
        </View>
      </View>

      <FlatList
        data={jobs}
        numColumns={isTablet ? 2 : 1}
        keyExtractor={(item) => item.id}
        
        // --- 2. Hero Section (ListHeaderComponent widiyata danna puluwan) ---
        ListHeaderComponent={
          <View>
            <ImageBackground 
              source={{ uri: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80' }} // Office environments image
              style={styles.heroBanner}
            >
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>Find Your Dream Job Today</Text>
                <Text style={styles.heroSub}>Explore over 1000+ new opportunities</Text>
                
                <TouchableOpacity style={styles.exploreBtn}>
                  <Text style={styles.exploreBtnText}>Browse Categories</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>

            <View style={styles.sectionHeader}>
              <Text style={styles.headerTitle}>Recent Job Openings</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>
          </View>
        }

        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
               {/* Job icon image ekak */}
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3850/3850285.png' }} 
                style={styles.jobIcon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.companyName}>Tech Solutions Inc.</Text>
              </View>
            </View>
            
            <View style={styles.footerRow}>
              <Text style={styles.dateText}>📅 {new Date(item.createdAt).toLocaleDateString()}</Text>
              <TouchableOpacity style={styles.applyBtn}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Nav Styles
  navBar: {
    flexDirection: 'row',
    height: 75,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    zIndex: 10,
  },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 30, height: 30, marginRight: 10 },
  brandName: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  navRight: { flexDirection: 'row', alignItems: 'center' },
  loginBtn: { marginRight: 15 },
  loginText: { color: '#007AFF', fontWeight: '600' },
  signupBtn: { backgroundColor: '#007AFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  signupText: { color: '#fff', fontWeight: '600' },

  // Hero Section Styles
  heroBanner: {
    width: '100%',
    height: 220,
    marginBottom: 20,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 51, 102, 0.6)', // Dark blue overlay
    justifyContent: 'center',
    padding: 25,
  },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  heroSub: { color: '#ddd', fontSize: 16, marginTop: 5 },
  exploreBtn: {
    backgroundColor: '#fff',
    width: 160,
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  exploreBtnText: { color: '#007AFF', fontWeight: 'bold' }
  ,userEmail: { fontSize: 14, color: '#0073ff', marginTop: 2, opacity: 0.9 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10 },

  // List Section Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  viewAll: { color: '#007AFF', fontWeight: '600' },

  // Card Styles
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  jobIcon: { width: 45, height: 45, borderRadius: 10, marginRight: 15, backgroundColor: '#F0F7FF' },
  jobTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  companyName: { color: '#64748B', fontSize: 14 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  dateText: { color: '#94A3B8', fontSize: 13 },
  applyBtn: { backgroundColor: '#E0F2FE', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 6 },
  applyText: { color: '#007AFF', fontWeight: 'bold' },
});