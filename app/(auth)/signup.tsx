import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
import { auth } from "../../services/firebase";

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

export default function Signup() {
  const router = useRouter();
  
  // States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1. Firebase හරහා Account එක සෑදීම
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. User ගේ Full Name එක Profile එකට එකතු කිරීම
      await updateProfile(userCredential.user, {
        displayName: username
      });

      Alert.alert("Success", "Account created successfully!");
      // _layout.tsx මගින් auto-redirect වනු ඇත
    } catch (error: any) {
      let errorMessage = "Signup failed!";
      if (error.code === 'auth/email-already-in-use') errorMessage = "Email already in use!";
      Alert.alert("Signup Error", errorMessage);
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
        <View style={styles.card}>

          {/* --- Image Section --- */}
          <View style={styles.imageSection}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=600&q=70' }} // Speed එක සඳහා resolution අඩු කර ඇත
              style={styles.workImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.overlayTitle}>Start Your Journey</Text>
              <Text style={styles.overlayText}>Explore career opportunities.</Text>
            </View>
          </View>

          {/* --- Form Section --- */}
          <View style={styles.formSection}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeTitle}>Create Account</Text>
              <Text style={styles.subTitle}>Join our community today</Text>
            </View>

            <View style={styles.inputGroup}>
              {/* Full Name Input */}
              <TextInput 
                placeholder="Full Name" 
                style={styles.input}
                onChangeText={setUsername}
                value={username}
              />

              {/* Email Input */}
              <TextInput 
                placeholder="Email Address" 
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              {/* Password Input */}
              <TextInput 
                placeholder="Password" 
                secureTextEntry 
                style={styles.input}
                onChangeText={setPassword}
                value={password}
              />

              {/* Confirm Password Input */}
              <TextInput 
                placeholder="Confirm Password" 
                secureTextEntry 
                style={styles.input}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
              />
              
              {/* Signup Button */}
              <TouchableOpacity 
                onPress={handleSignup} 
                style={[styles.signupBtn, loading && styles.disabledBtn]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.signupBtnText}>CREATE ACCOUNT</Text>
                )}
              </TouchableOpacity>

              {/* Google Button (Optional UI) */}
              <TouchableOpacity style={styles.googleBtn}>
                 <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} style={styles.googleIcon} />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push("/login")} 
                style={styles.loginLink}
              >
                <Text style={styles.footerText}>
                  Already have an account? <Text style={styles.linkBlue}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: {
    backgroundColor: 'white',
    width: isLargeScreen ? '85%' : '100%',
    maxWidth: 1100,
    flexDirection: isLargeScreen ? 'row' : 'column',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  imageSection: { flex: isLargeScreen ? 1.2 : 0, height: isLargeScreen ? 'auto' : 220, position: 'relative' },
  workImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 51, 102, 0.4)', justifyContent: 'center', padding: 25 },
  overlayTitle: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  overlayText: { color: 'white', fontSize: 14, marginTop: 5 },
  formSection: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#FFFFFF' },
  headerTextContainer: { marginBottom: 25, alignItems: 'center' },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', color: '#003366' },
  subTitle: { color: '#64748B', marginTop: 5, fontSize: 16 },
  inputGroup: { width: '100%' },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    backgroundColor: '#F8FAFC',
    fontSize: 16,
  },
  signupBtn: {
    backgroundColor: '#A0C4FF', // Light blue (ඔයාගේ screenshot එකේ විදියට)
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: { opacity: 0.6 },
  signupBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  googleBtn: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 50,
    width: 60,
    alignSelf: 'center'
  },
  googleIcon: { width: 30, height: 30 },
  loginLink: { marginTop: 25, alignItems: 'center' },
  footerText: { color: '#64748B', fontSize: 15 },
  linkBlue: { color: '#007AFF', fontWeight: 'bold' },
});