import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
  const navigation = useNavigation();
  
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Basic Validation
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
      // Navigation to Home or Profile usually happens automatically via Auth Listener
    } catch (error: any) {
      let errorMessage = "Signup failed!";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "That email address is already in use!";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "That email address is invalid!";
      }
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
              source={{ uri: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&q=80' }} 
              style={styles.workImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.overlayTitle}>Start Your Journey</Text>
              <Text style={styles.overlayText}>Create an account to explore thousands of career opportunities.</Text>
            </View>
          </View>

          {/* --- Form Section --- */}
          <View style={styles.formSection}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeTitle}>Create Account</Text>
              <Text style={styles.subTitle}>Join our community today</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                placeholder="name@example.com" 
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput 
                placeholder="Minimum 6 characters" 
                secureTextEntry 
                style={styles.input}
                onChangeText={setPassword}
                value={password}
              />

              <Text style={styles.label}>Confirm Password</Text>
              <TextInput 
                placeholder="Repeat your password" 
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

              <TouchableOpacity 
                onPress={() => navigation.navigate('login' as never)} 
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
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    width: isLargeScreen ? '85%' : '100%',
    maxWidth: 1100,
    flexDirection: isLargeScreen ? 'row' : 'column',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 25,
  },
  imageSection: {
    flex: isLargeScreen ? 1.3 : 0,
    height: isLargeScreen ? 'auto' : 200,
    position: 'relative',
  },
  workImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 88, 204, 0.5)',
    justifyContent: 'center',
    padding: 30,
  },
  overlayTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  overlayText: {
    color: 'white',
    fontSize: 15,
    marginTop: 8,
    lineHeight: 20,
  },
  formSection: {
    flex: 1,
    padding: isLargeScreen ? 50 : 30,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerTextContainer: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
  },
  subTitle: {
    color: '#64748B',
    marginTop: 5,
    fontSize: 15,
  },
  inputGroup: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#1E293B',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    backgroundColor: '#F8FAFC',
    fontSize: 16,
  },
  signupBtn: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledBtn: {
    backgroundColor: '#A0C4FF',
  },
  signupBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  loginLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 15,
  },
  linkBlue: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});