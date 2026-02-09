import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import React, { useEffect, useState } from "react";
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
  View,
} from "react-native";
import { auth } from "../../services/firebase";


WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get("window");
const isLargeScreen = width > 768;

export default function Signup() {
  const navigation = useNavigation<any>();

  // States
  const[username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- GOOGLE AUTH ---------------- */
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
});

useEffect(() => {
  if (response?.type === "success") {
    const idToken = response.params.id_token;

    if (!idToken) {
      Alert.alert("Error", "Google ID token not found");
      return;
    }

    const credential = GoogleAuthProvider.credential(idToken);

    signInWithCredential(auth, credential)
      .then(() => Alert.alert("Success", "Signed in with Google"))
      .catch(() => Alert.alert("Error", "Google sign-in failed"));
  }
}, [response]);


  /* ---------------- EMAIL SIGNUP ---------------- */
  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
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
    } catch (error: any) {
      let errorMessage = "Signup failed!";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "That email address is already in use!";
      } else if (error.code === "auth/invalid-email") {
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

          {/* IMAGE SECTION */}
          <View style={styles.imageSection}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&q=80" }}
              style={styles.workImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.overlayTitle}>Start Your Journey</Text>
              <Text style={styles.overlayText}>
                Create an account to explore thousands of career opportunities.
              </Text>
            </View>
          </View>

          {/* FORM SECTION */}
          <View style={styles.formSection}>
            <Text style={styles.welcomeTitle}>Create Account</Text>                                                                                                                                                                                                                                                                                               
            <Text style={styles.subTitle}>Join our community today</Text>

            <TextInput
              placeholder="Username"
              style={styles.input}
              onChangeText={setUsername}
              value={username}
            />
 

            <TextInput
              placeholder="Email"
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
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
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.signupBtnText}>CREATE ACCOUNT</Text>}
            </TouchableOpacity>

            {/* SOCIAL LOGIN ROW */}
            <View style={styles.socialRow}>
              <TouchableOpacity onPress={() => promptAsync()}>
                <Image source={require("./google.png")} style={styles.socialIcon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Alert.alert("Info", "Facebook login coming soon")}>
                <Image source={require("./facebook.png")} style={styles.socialIcon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Alert.alert("Info", "LinkedIn login coming soon")}>
                <Image source={require("./linkedin.png")} style={styles.socialIcon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Text style={styles.footerText}>
                Already have an account? <Text style={styles.linkBlue}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    backgroundColor: "white",
    width: isLargeScreen ? "85%" : "100%",
    flexDirection: isLargeScreen ? "row" : "column",
    borderRadius: 25,
    overflow: "hidden",
  },
  imageSection: { flex: 1.3, height: isLargeScreen ? "auto" : 200 },
  workImage: { width: "100%", height: "100%" },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,88,204,0.5)",
    justifyContent: "center",
    padding: 30,
  },
  overlayTitle: { color: "white", fontSize: 28, fontWeight: "bold" },
  overlayText: { color: "white", marginTop: 8 },
  formSection: { flex: 1, padding: 30 },
  welcomeTitle: { fontSize: 26, fontWeight: "bold", color: "#003366" },
  subTitle: { color: "#64748B", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#F8FAFC",
  },
  signupBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  disabledBtn: { backgroundColor: "#A0C4FF" },
  signupBtnText: { color: "white", fontWeight: "bold" },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 20,
  },
  socialIcon: { width: 40, height: 40 },
  footerText: { textAlign: "center", color: "#64748B" },
  linkBlue: { color: "#007AFF", fontWeight: "bold" },
});
