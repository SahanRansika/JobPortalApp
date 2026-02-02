import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

const Tasks = () => {
  const router = useRouter();

  // Udaharanayak widiyata data tikak
  const dummyTasks = [
    { id: '1', title: 'Finish Project Proposal', category: 'Work', status: 'Pending' },
    { id: '2', title: 'Meeting with Client', category: 'Work', status: 'Completed' },
    { id: '3', title: 'Buy Groceries', category: 'Personal', status: 'Pending' },
  ];

  return (
    <View style={styles.container}>
      {/* --- Header Section --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <Text style={styles.headerSub}>You have {dummyTasks.filter(t => t.status === 'Pending').length} tasks for today</Text>
      </View>

      {/* --- Task List Section --- */}
      <FlatList
        data={dummyTasks}
        numColumns={isLargeScreen ? 2 : 1}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={[styles.statusIndicator, { backgroundColor: item.status === 'Completed' ? '#4CAF50' : '#007AFF' }]} />
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskCategory}>{item.category}</Text>
            </View>
            {item.status === 'Completed' && (
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            )}
          </View>
        )}
      />

      {/* --- Floating Action Button (FAB) --- */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.fab}
        onPress={() => router.push("/tasks/form" as any)}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Very light gray/white background
  },
  header: {
    padding: 25,
    backgroundColor: '#007AFF', // Solid Blue Header
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSub: {
    fontSize: 14,
    color: '#E0F2FE',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingTop: 20,
  },
  taskCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 8,
    flex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  statusIndicator: {
    width: 5,
    height: '100%',
    borderRadius: 5,
    marginRight: 15,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  taskCategory: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    width: 65,
    height: 65,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  }
});

export default Tasks;