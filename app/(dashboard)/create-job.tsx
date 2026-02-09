import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    StyleSheet,
    Text, 
    TextInput, 
    TouchableOpacity,
    View
} from "react-native";
import { addJob } from "../../services/jobService";

export default function CreateJob() {
  const router = useRouter(); // navigation වෙනුවට router පාවිච්චි කරමු

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validation
    if (!title || !company || !salary || !description) {
      Alert.alert("Error", "Please fill all the fields before saving.");
      return;
    }

    setLoading(true);
    try {
      // නව Job එක සේව් කිරීම
      await addJob({ 
        title, 
        company, 
        salary, 
        description, 
        createdAt: new Date().toISOString(),
        status: 'Open' 
      });
      
      Alert.alert("Success", "Job posted successfully!", [
        { 
          text: "OK", 
          onPress: () => {
            // Form එක clear කිරීම
            setTitle("");
            setCompany("");
            setSalary("");
            setDescription("");
            // Home එකට auto යැවීම
            router.push("/home" as any);
          } 
        }
      ]);
      
    } catch (error) {
      Alert.alert("Error", "Failed to save job. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Post a New Job</Text>
          <Text style={styles.headerSubtitle}>Fill in the details to find the best candidates</Text>
        </View>

        <View style={styles.form}>
          {/* Job Title */}
          <Text style={styles.label}>Job Title</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="briefcase-outline" size={20} color="#007AFF" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Software Engineer" 
              value={title}
              onChangeText={setTitle} 
            />
          </View>

          {/* Company Name */}
          <Text style={styles.label}>Company Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="business-outline" size={20} color="#007AFF" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Google" 
              value={company}
              onChangeText={setCompany} 
            />
          </View>

          {/* Salary */}
          <Text style={styles.label}>Salary Range</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#007AFF" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="e.g. $5000 - $7000" 
              value={salary}
              onChangeText={setSalary} 
            />
          </View>

          {/* Description */}
          <Text style={styles.label}>Job Description</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Describe the job requirements and responsibilities..." 
              multiline={true}
              numberOfLines={4}
              value={description}
              onChangeText={setDescription} 
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.btnContent}>
                <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
                <Text style={styles.saveButtonText}>Post This Job</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { padding: 20 },
  header: { marginBottom: 25, marginTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  form: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8 
  },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8, marginLeft: 4 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f3f5', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#e9ecef' 
  },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },
  textAreaContainer: { alignItems: 'flex-start', paddingVertical: 10 },
  textArea: { height: 100 },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  saveButton: { 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 12, 
    marginTop: 10 
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  disabledButton: { backgroundColor: '#ccc' }
});