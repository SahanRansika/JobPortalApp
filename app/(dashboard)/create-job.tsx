import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
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
import { auth } from "../../services/firebase";

export default function CreateJob() {
    const router = useRouter();
    
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [salary, setSalary] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // පින්තූරයක් තෝරාගැනීම
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images, // TypeScript error එක මෙතැනින් විසඳේ
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5, 
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Cloudinary වෙත Image එක upload කිරීම
    const uploadToCloudinary = async (fileUri: string) => {
        const data = new FormData();
        data.append('file', {
            uri: fileUri,
            type: 'image/jpeg',
            name: 'job_banner.jpg',
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
        const currentUser = auth.currentUser;

        if (!currentUser) {
            Alert.alert("Error", "You must be logged in to post a job.");
            return;
        }

        if (!title.trim() || !company.trim() || !salary.trim() || !description.trim() || !image) {
            Alert.alert("Error", "Please fill all fields and select a banner image.");
            return;
        }

        setLoading(true);
        try {
            // 1. Image එක Cloudinary දාමු
            const imageUrl = await uploadToCloudinary(image);
            
            // 2. Job එක Firestore එකේ save කරමු
            await addJob({ 
                title: title.trim(), 
                company: company.trim(), 
                salary: salary.trim(), 
                description: description.trim(), 
                imageUrl,
                postedBy: currentUser.uid, // <--- මෙය ඉතා වැදගත් (Recruiter ID)
                creatorEmail: currentUser.email, 
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
            Alert.alert("Error", "Failed to post job. Please try again.");
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
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Post a Job</Text>
                    <Text style={styles.headerSubtitle}>Find the perfect candidate today</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Job Banner</Text>
                    <TouchableOpacity 
                        style={[styles.imagePicker, image ? styles.imageActive : null]} 
                        onPress={pickImage}
                    >
                        {image ? (
                            <Image source={{ uri: image }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.pickerPlaceholder}>
                                <Ionicons name="image-outline" size={40} color="#007AFF" />
                                <Text style={{color: '#64748b', marginTop: 8}}>Upload Banner</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.label}>Job Title</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="e.g. Senior Software Engineer" 
                        value={title} 
                        onChangeText={setTitle} 
                    />

                    <Text style={styles.label}>Company Name</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="e.g. Google" 
                        value={company} 
                        onChangeText={setCompany} 
                    />

                    <Text style={styles.label}>Salary (LKR / Month)</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="e.g. 250000" 
                        keyboardType="numeric" 
                        value={salary} 
                        onChangeText={setSalary} 
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        placeholder="Write job details here..." 
                        multiline 
                        numberOfLines={5} 
                        textAlignVertical="top" 
                        value={description} 
                        onChangeText={setDescription} 
                    />

                    <TouchableOpacity 
                        style={[styles.saveButton, loading && styles.disabledButton]} 
                        onPress={handleSave} 
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={styles.btnContent}>
                                <Ionicons name="rocket-outline" size={22} color="#fff" />
                                <Text style={styles.saveButtonText}>Publish Now</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    scrollContainer: { padding: 20, paddingTop: 40 },
    header: { marginBottom: 20 },
    backBtn: { marginBottom: 10 },
    headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#0f172a' },
    headerSubtitle: { fontSize: 14, color: '#64748b' },
    form: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 3 },
    label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
    input: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 18, borderWidth: 1, borderColor: '#e2e8f0' },
    imagePicker: { height: 150, backgroundColor: '#f1f5f9', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', overflow: 'hidden' },
    imageActive: { borderStyle: 'solid', borderColor: '#007AFF' },
    previewImage: { width: '100%', height: '100%' },
    pickerPlaceholder: { alignItems: 'center' },
    textArea: { height: 120 },
    btnContent: { flexDirection: 'row', alignItems: 'center' },
    saveButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    disabledButton: { backgroundColor: '#94a3b8' }
});