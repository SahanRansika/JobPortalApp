import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, Image 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllUsers, promoteToRecruiter } from "../../services/jobService";

export default function AddRecruiter() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handlePromote = (userId: string, userName: string) => {
    Alert.alert(
      "Confirm",
      `Are you sure you want to promote ${userName} to Recruiter?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Promote", 
          onPress: async () => {
            setActionLoading(userId);
            try {
              await promoteToRecruiter(userId);
              Alert.alert("Success", "User promoted successfully!");
              fetchUsers(); // ලැයිස්තුව refresh කිරීම
            } catch (error) {
              Alert.alert("Error", "Failed to promote user.");
            } finally {
              setActionLoading(null);
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Recruiter</Text>
        <TouchableOpacity onPress={fetchUsers}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.username?.charAt(0).toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={styles.userName}>{item.username}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.promoteBtn} 
                onPress={() => handlePromote(item.id, item.username)}
                disabled={actionLoading === item.id}
              >
                {actionLoading === item.id ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.promoteBtnText}>Promote</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No registered job seekers found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 20, 
    paddingTop: 60, 
    backgroundColor: "#fff",
    elevation: 2 
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1E293B" },
  userCard: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 15, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    marginBottom: 15,
    elevation: 1
  },
  userInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { 
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: "#007AFF", 
    justifyContent: "center", alignItems: "center", marginRight: 15 
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#1E293B" },
  userEmail: { fontSize: 13, color: "#64748B" },
  promoteBtn: { 
    backgroundColor: "#10B981", 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 10 
  },
  promoteBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  emptyText: { textAlign: "center", color: "#64748B", marginTop: 50 }
});