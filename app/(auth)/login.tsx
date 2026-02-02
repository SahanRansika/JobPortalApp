import { 
  View, 
  TextInput, 
  Text, 
  Image,
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Firebase automatically updates the auth state listener
      alert("Welcome back!");
    } catch (error: any) {
      let errorMessage = "Login failed!";
      if (error.code === 'auth/user-not-found') errorMessage = "No user found with this email.";
      if (error.code === 'auth/wrong-password') errorMessage = "Incorrect password.";
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          
          {/* --- Image Section --- */}
          <View style={styles.imageSection}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174' }} 
              style={styles.workImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.overlayTitle}>Welcome Back</Text>
              <Text style={styles.overlayText}>Log in to continue your journey and manage your applications.</Text>
            </View>
          </View>

          {/* --- Form Section --- */}
          <View style={styles.formSection}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeTitle}>Login</Text>
              <Text style={styles.subTitle}>Enter your credentials to access your account</Text>
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
                textContentType="emailAddress"
              />

              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <TextInput 
                placeholder="Enter your password" 
                secureTextEntry 
                style={styles.input}
                onChangeText={setPassword} 
                value={password}
                textContentType="password"
              />
              
              <TouchableOpacity 
                onPress={handleLogin} 
                style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginBtnText}>LOG IN</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate('signup' as never)} 
                style={styles.signupLink}
              >
                <Text style={styles.footerText}>
                  New Here ? <Text style={styles.linkBlue}>Create Account</Text>
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
    height: isLargeScreen ? 'auto' : 220,
    position: 'relative',
  },
  workImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 51, 102, 0.6)', 
    justifyContent: 'center',
    padding: 30,
  },
  overlayTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
  },
  formSection: {
    flex: 1,
    padding: isLargeScreen ? 50 : 30,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerTextContainer: {
    marginBottom: 35,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
  },
  subTitle: {
    color: '#64748B',
    marginTop: 5,
    fontSize: 16,
  },
  inputGroup: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
    marginBottom: 10,
    color: '#1E293B',
    fontSize: 14,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 22,
    backgroundColor: '#F8FAFC',
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  signupLink: {
    marginTop: 30,
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