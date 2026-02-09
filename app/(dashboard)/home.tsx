import { useEffect, useState } from "react";
import { 
  Dimensions, 
  FlatList, 
  Image, 
  ImageBackground, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  ActivityIndicator,
  RefreshControl,
  Platform
} from "react-native";
import { getJobs } from "../../services/jobService";
import { auth } from "../../services/firebase";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Firebase එකෙන් Jobs ලබා ගැනීම
  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const getUserName = () => {
    const user = auth.currentUser;
    if (user?.displayName) return user.displayName;
    return user?.email?.split('@')[0] || "User";
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#64748B' }}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      
      {/* --- Header Section --- */}
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
            <Text style={styles.userGreeting}>Welcome back,</Text>
            <Text style={styles.userNameText}>{getUserName()}</Text>
          </View>
          <Image 
            source={{ uri: auth.currentUser?.photoURL || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
            style={styles.userAvatar} 
          />
        </View>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View>
            <ImageBackground 
              source={{ uri: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80' }} 
              style={styles.heroBanner}
              imageStyle={{ borderRadius: 0 }}
            >
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>Grow Your Career</Text>
                <Text style={styles.heroSub}>Find the perfect job for your skills</Text>
              </View>
            </ImageBackground>

            <View style={styles.sectionHeader}>
              <Text style={styles.headerTitle}>Latest Job Posts</Text>
              <TouchableOpacity onPress={onRefresh}>
                <Text style={styles.viewAll}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push({
              pathname: "/(dashboard)/show-job",
              params: { 
                id: item.id,
                title: item.title,
                company: item.company,
                salary: item.salary,
                description: item.description,
                imageUrl: item.imageUrl 
              }
            } as any)}
          >
            <View style={styles.cardRow}>
              {/* Cloudinary URL එක හරහා එන Image එක */}
              <Image 
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
                style={styles.jobIcon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.companyName}>{item.company}</Text>
              </View>
            </View>
            
            <View style={styles.footerRow}>
              <View>
                <Text style={styles.salaryText}>💰 LKR {item.salary}</Text>
                <Text style={styles.dateText}>📅 {new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.detailsBtn}>
                <Text style={styles.detailsText}>View Details</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: '#64748B' }}>No jobs available at the moment.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  navBar: { 
    flexDirection: 'row', 
    height: Platform.OS === 'ios' ? 110 : 90, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  navRight: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 30, height: 30, marginRight: 10 },
  brandName: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  userInfo: { alignItems: 'flex-end', marginRight: 12 },
  userGreeting: { fontSize: 10, color: '#64748B', textTransform: 'uppercase' },
  userNameText: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  userAvatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: '#007AFF' },
  
  heroBanner: { width: '100%', height: 180, marginBottom: 20 },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 25 },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  heroSub: { color: '#eee', fontSize: 15, marginTop: 4 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 },
  headerTitle: { fontSize: 19, fontWeight: 'bold', color: '#1E293B' },
  viewAll: { color: '#007AFF', fontWeight: '600' },

  card: { 
    backgroundColor: '#fff', 
    marginHorizontal: 18, 
    marginVertical: 10, 
    padding: 18, 
    borderRadius: 20, 
    elevation: 4, 
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  jobIcon: { width: 60, height: 60, borderRadius: 14, marginRight: 15, backgroundColor: '#F1F5F9' },
  jobTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  companyName: { color: '#64748B', fontSize: 14, marginTop: 3 },
  
  footerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 15, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9', 
    paddingTop: 12,
    alignItems: 'center'
  },
  salaryText: { color: '#10B981', fontSize: 15, fontWeight: 'bold' },
  dateText: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  detailsBtn: { backgroundColor: '#E0F2FE', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  detailsText: { color: '#007AFF', fontWeight: 'bold', fontSize: 13 }
});