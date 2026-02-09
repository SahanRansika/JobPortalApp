import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
// මෙතනට MediaType import කරගන්න
import { MediaTypeOptions } from 'expo-image-picker'; 
import {
    ActivityIndicator,
    Alert,
    Image,
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
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Image Picking Function ---
  const pickImage = async () => {
    // මෙතන ImagePicker.MediaType.Images වෙනුවට MediaTypeOptions.Images පාවිච්චි කරන්න
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.3, 
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // --- Cloudinary Upload Function ---
  const uploadToCloudinary = async (fileUri: string) => {
    const data = new FormData();
    data.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'job_post.jpg',
    } as any);
    
    data.append('upload_preset', 'jobportal'); 

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dt2xaqo32/image/upload', {
        method: 'POST',
        body: data,
      });
      const file = await res.json();
      
      if (file.secure_url) {
        return file.secure_url;
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (e) {
      console.error("Cloudinary Error: ", e);
      throw e;
    }
  };

  const handleSave = async () => {
    if (!title || !company || !salary || !description || !image) {
      Alert.alert("Error", "Please fill all fields and select an image.");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(image);
      
      await addJob({ 
        title, 
        company, 
        salary, 
        description, 
        imageUrl,
        createdAt: new Date().toISOString(),
        status: 'Open' 
      });
      
      Alert.alert("Success", "Job posted successfully!", [
        { 
          text: "OK", 
          onPress: () => router.replace("/(dashboard)/home") 
        }
      ]);
      
    } catch (error) {
        console.error("Save Error: ", error);
        Alert.alert("Error", "Failed to save job. Check internet/Cloudinary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Post a New Job</Text>
          <Text style={styles.headerSubtitle}>Enter details to reach top candidates</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Job/Company Banner</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.pickerPlaceholder}>
                <Ionicons name="camera-outline" size={40} color="#007AFF" />
                <Text style={{color: '#64748B', marginTop: 5}}>Upload Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Job Title</Text>
          <TextInput style={styles.input} placeholder="e.g. Senior Graphic Designer" value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Company Name</Text>
          <TextInput style={styles.input} placeholder="e.g. ABC Company" value={company} onChangeText={setCompany} />

          <Text style={styles.label}>Salary Range</Text>
          <TextInput style={styles.input} placeholder="e.g. 80000" keyboardType="numeric" value={salary} onChangeText={setSalary} />

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Describe the role..." multiline numberOfLines={4} textAlignVertical="top" value={description} onChangeText={setDescription} />

          <TouchableOpacity style={[styles.saveButton, loading && styles.disabledButton]} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
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
  scrollContainer: { padding: 20, paddingTop: 50 },
  header: { marginBottom: 25 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8 },
  input: { backgroundColor: '#f1f3f5', borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e9ecef' },
  imagePicker: { height: 180, backgroundColor: '#f1f3f5', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#007AFF', overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  pickerPlaceholder: { alignItems: 'center' },
  textArea: { height: 120 },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  saveButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  disabledButton: { backgroundColor: '#A5C9FF' }
});