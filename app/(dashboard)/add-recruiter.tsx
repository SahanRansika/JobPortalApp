import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, ScrollView, Modal, TextInput 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../services/firebase";
import { updateUserRole, deleteUser, updateUserDetails } from "../../services/jobService";

export default function AdminPanel() {
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [jobSeekers, setJobSeekers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Update Modal States
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    // Real-time Update ලැබෙන පරිදි Firestore සම්බන්ධ කිරීම
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecruiters(allUsers.filter((u: any) => u.role === "recruiter"));
      setJobSeekers(allUsers.filter((u: any) => u.role === "user" || !u.role));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Functions ---
  const handleRoleChange = (userId: string, name: string, targetRole: string) => {
    Alert.alert("Change Role", `Do you want to make ${name} a ${targetRole}?`, [
      { text: "Cancel" },
      { text: "Confirm", onPress: () => updateUserRole(userId, targetRole) }
    ]);
  };

  const handleDelete = (userId: string, name: string) => {
    Alert.alert("Delete User", `Are you sure you want to permanently delete ${name}?`, [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteUser(userId) }
    ]);
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setNewName(user.username);
    setNewEmail(user.email);
    setEditModalVisible(true);
  };

  const handleSaveUpdate = async () => {
    if (!newName || !newEmail) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    try {
      await updateUserDetails(selectedUser.id, newName, newEmail);
      setEditModalVisible(false);
      Alert.alert("Success", "User details updated!");
    } catch (error) {
      Alert.alert("Error", "Failed to update user.");
    }
  };

  // --- UI Components ---
  const UserItem = ({ item, type }: { item: any, type: 'recruiter' | 'user' }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={[styles.avatar, { backgroundColor: type === 'recruiter' ? '#6366F1' : '#007AFF' }]}>
          <Text style={styles.avatarText}>{item.username?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.username}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        {/* Edit Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
          <Ionicons name="create-outline" size={20} color="#F59E0B" />
        </TouchableOpacity>

        {/* Promote/Demote Button */}
        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => handleRoleChange(item.id, item.username, type === 'recruiter' ? 'user' : 'recruiter')}
        >
          <Ionicons name={type === 'recruiter' ? "arrow-down-circle-outline" : "arrow-up-circle-outline"} size={20} color="#10B981" />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id, item.username)}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1E293B" /></TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* TOP: Recruiters */}
        <View style={styles.sectionHeader}>
          <Ionicons name="briefcase" size={20} color="#6366F1" />
          <Text style={styles.sectionTitle}>Recruiters ({recruiters.length})</Text>
        </View>
        {recruiters.map(item => <UserItem key={item.id} item={item} type="recruiter" />)}
        {recruiters.length === 0 && <Text style={styles.emptyText}>No recruiters assigned.</Text>}

        <View style={styles.divider} />

        {/* BOTTOM: Job Seekers */}
        <View style={styles.sectionHeader}>
          <Ionicons name="people" size={20} color="#007AFF" />
          <Text style={styles.sectionTitle}>Job Seekers ({jobSeekers.length})</Text>
        </View>
        {jobSeekers.map(item => <UserItem key={item.id} item={item} type="user" />)}
        {jobSeekers.length === 0 && <Text style={styles.emptyText}>No users found.</Text>}

      </ScrollView>

      {/* --- Edit User Modal --- */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User Info</Text>
            <TextInput style={styles.modalInput} value={newName} onChangeText={setNewName} placeholder="Full Name" />
            <TextInput style={styles.modalInput} value={newEmail} onChangeText={setNewEmail} placeholder="Email" keyboardType="email-address" />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                <Text style={{color: '#64748B'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveUpdate}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingTop: 60, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: '#1E293B' },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#334155" },
  userCard: { backgroundColor: "#fff", padding: 12, borderRadius: 16, flexDirection: "row", alignItems: "center", marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  userInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { width: 42, height: 42, borderRadius: 21, justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  userName: { fontSize: 15, fontWeight: "600", color: '#1E293B' },
  userEmail: { fontSize: 12, color: "#64748B", marginTop: 2 },
  actions: { flexDirection: "row", alignItems: "center" },
  actionBtn: { padding: 8, marginLeft: 4 },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 25, borderStyle: 'dashed', borderRadius: 1 },
  emptyText: { textAlign: "center", color: "#94A3B8", marginVertical: 10, fontSize: 13 },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 25 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#1E293B' },
  modalInput: { backgroundColor: '#F1F5F9', padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: { padding: 15, marginRight: 10 },
  saveBtn: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12 },
});