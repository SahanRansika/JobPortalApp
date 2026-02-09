import { useEffect, useState } from "react";
import { 
  Dimensions, 
  FlatList, 
  Image, 
  ImageBackground, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from "react-native";
import { getJobs } from "../../services/jobService";
import { auth } from "../../services/firebase"; // ඔබගේ firebase path එක පරීක්ෂා කරන්න
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  // පරිශීලකයාගේ නම ලබා ගැනීම
  const getUserName = () => {
    const user = auth.currentUser;
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      const namePart = user.email.split('@')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return "Guest User";
  };

  // පරිශීලකයාගේ පින්තූරය ලබා ගැනීම (නැතිනම් default එකක් පෙන්වීම)
  const getUserImage = () => {
    return auth.currentUser?.photoURL || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  };

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
          <View style={styles.userInfo}>
            <Text style={styles.userGreeting}>Hello,</Text>
            <Text style={styles.userNameText}>{getUserName()}</Text>
          </View>
          
          {/* Profile Image එක මෙතැනට එක් කරන ලදි */}
          <TouchableOpacity onPress={() => router.push("/profile" as any)}>
            <Image 
              source={{ uri: getUserImage() }} 
              style={styles.userAvatar} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={jobs}
        numColumns={isTablet ? 2 : 1}
        keyExtractor={(item) => item.id}
        
        ListHeaderComponent={
          <View>
            <ImageBackground 
              source={{ uri: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80' }} 
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
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
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
              <TouchableOpacity 
                style={styles.applyBtn}
                onPress={() => router.push({ pathname: "/job-details/[id]", params: { id: item.id } } as any)}
              >
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }} // Tab bar එකට වැසීම වැළැක්වීමට
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    height: 90,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    zIndex: 10,
  },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 30, height: 30, marginRight: 10 },
  brandName: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  navRight: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { alignItems: 'flex-end', marginRight: 12 },
  userGreeting: { fontSize: 11, color: '#64748B', textTransform: 'uppercase' },
  userNameText: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#007AFF',
  },

  heroBanner: { width: '100%', height: 220, marginBottom: 20 },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 51, 102, 0.6)',
    justifyContent: 'center',
    padding: 25,
  },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  heroSub: { color: '#ddd', fontSize: 16, marginTop: 5 },
  exploreBtn: {
    backgroundColor: '#fff',
    width: 160,
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  exploreBtnText: { color: '#007AFF', fontWeight: 'bold' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  viewAll: { color: '#007AFF', fontWeight: '600' },

  card: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 15,
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  jobIcon: { width: 50, height: 50, borderRadius: 12, marginRight: 15, backgroundColor: '#F0F7FF' },
  jobTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  companyName: { color: '#64748B', fontSize: 14, marginTop: 2 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  dateText: { color: '#94A3B8', fontSize: 13 },
  applyBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  applyText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});