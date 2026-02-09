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
import { auth, db } from "../../services/firebase"; // db සහ auth import කරන්න
import { doc, setDoc } from "firebase/firestore"; // Firestore functions

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

export default function Signup() {
  const router = useRouter();
  
  // Form States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // 1. Validation
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 2. Firebase Auth හරහා Account එක සෑදීම
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 3. පරිශීලකයාගේ Full Name එක Profile එකට එකතු කිරීම
      await updateProfile(user, {
        displayName: username
      });

      // 4. Firestore හි පරිශීලක දත්ත සහ Role එක (user) තැන්පත් කිරීම
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        role: "user", // Default role එක user ලෙස පවතී
        createdAt: new Date().toISOString()
      });

      // 5. සාර්ථකව අවසන් වූ පසු Home Page එකට Redirect කිරීම
      Alert.alert(
        "Success", 
        "Account created successfully!",
        [
          { 
            text: "OK", 
            onPress: () => router.replace("/(dashboard)/home") 
          }
        ]
      );

    } catch (error: any) {
      let errorMessage = "Signup failed!";
      
      if (error.code === 'auth/email-already-in-use') errorMessage = "This email is already registered.";
      if (error.code === 'auth/invalid-email') errorMessage = "Please enter a valid email address.";
      if (error.code === 'auth/weak-password') errorMessage = "Password should be at least 6 characters.";
      
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

          {/* --- Header Image Section --- */}
          <View style={styles.imageSection}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=600&q=70' }} 
              style={styles.workImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.overlayTitle}>Start Your Journey</Text>
              <Text style={styles.overlayText}>Explore career opportunities.</Text>
            </View>
          </View>

          {/* --- Input Form Section --- */}
          <View style={styles.formSection}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeTitle}>Create Account</Text>
              <Text style={styles.subTitle}>Join our community today</Text>
            </View>

            <View style={styles.inputGroup}>
              <TextInput 
                placeholder="Full Name" 
                style={styles.input}
                onChangeText={setUsername}
                value={username}
              />

              <TextInput 
                placeholder="Email Address" 
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput 
                placeholder="Password" 
                secureTextEntry 
                style={styles.input}
                onChangeText={setPassword}
                value={password}
              />

              <TextInput 
                placeholder="Confirm Password" 
                secureTextEntry 
                style={styles.input}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
              />
              
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

              {/* Google Button UI */}
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
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imageSection: { flex: isLargeScreen ? 1.2 : 0, height: isLargeScreen ? 'auto' : 220, position: 'relative' },
  workImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 51, 102, 0.4)', justifyContent: 'center', padding: 25 },
  overlayTitle: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  overlayText: { color: 'white', fontSize: 14, marginTop: 5 },
  formSection: { flex: 1, padding: 30, justifyContent: 'center' },
  headerTextContainer: { marginBottom: 20, alignItems: 'center' },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', color: '#003366' },
  subTitle: { color: '#64748B', marginTop: 5, fontSize: 15 },
  inputGroup: { width: '100%' },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  signupBtn: {
    backgroundColor: '#A0C4FF', 
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: { opacity: 0.6 },
  signupBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  googleBtn: {
    marginTop: 15,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 50,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  googleIcon: { width: 25, height: 25 },
  loginLink: { marginTop: 20, alignItems: 'center' },
  footerText: { color: '#64748B', fontSize: 14 },
  linkBlue: { color: '#007AFF', fontWeight: 'bold' },
});