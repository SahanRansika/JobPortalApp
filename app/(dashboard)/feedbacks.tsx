import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import { sendFeedback, deleteFeedback } from "../../services/jobService";

export default function FeedbackPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState<string>("user");
  const [currentUsername, setCurrentUsername] = useState<string>("User");
  const [loading, setLoading] = useState(true);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // 1. පරිශීලකයාගේ Role එක Firestore එකෙන් ලබා ගැනීම
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setCurrentUserRole(userDoc.data().role || "user");
            setCurrentUsername(userDoc.data().username || "User");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };
    fetchUserData();

    // 2. Feedback පණිවිඩ Real-time ලබා ගැනීම
    const q = query(collection(db, "feedbacks"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
      // අලුත් පණිවිඩයක් ආවම ස්වයංක්‍රීයව පහළට යාමට
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const user = auth.currentUser;
    if (!user || !user.uid) {
      Alert.alert("Error", "You must be logged in to send messages.");
      return;
    }

    const userData = {
      uid: user.uid,
      username: currentUsername,
      role: currentUserRole
    };

    try {
      await sendFeedback(inputText, userData);
      setInputText("");
    } catch (error) {
      Alert.alert("Failed", "Could not send message.");
    }
  };

  const handleDeleteMessage = (id: string, senderId: string) => {
    const isAdmin = currentUserRole === 'admin';
    const isOwner = senderId === auth.currentUser?.uid;

    if (isAdmin || isOwner) {
      Alert.alert("Delete Message", "Are you sure you want to remove this?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteFeedback(id) }
      ]);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#EF4444';
      case 'recruiter': return '#8B5CF6';
      default: return '#0EA5E9';
    }
  };

  const renderItem = ({ item }: any) => {
    const isMe = item.userId === auth.currentUser?.uid;

    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMsgWrapper : styles.otherMsgWrapper]}>
        <TouchableOpacity 
          onLongPress={() => handleDeleteMessage(item.id, item.userId)}
          activeOpacity={0.8}
          style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}
        >
          <View style={styles.msgHeader}>
            <Text style={[styles.senderName, { color: isMe ? '#E0F2FE' : getRoleColor(item.role) }]}>
              {item.username} • {item.role?.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.msgText, isMe && { color: '#fff' }]}>{item.text}</Text>
          <Text style={[styles.timeText, isMe ? { color: '#BFDBFE' } : { color: '#94A3B8' }]}>
            {formatTime(item.createdAt)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community Chat</Text>
          <Text style={styles.headerSub}>Admin, Recruiters & Seekers</Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
            )}
          />
        )}

        {/* Input area positioned above the tab bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && styles.disabledSend]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { 
    paddingTop: Platform.OS === 'android' ? 10 : 0, 
    paddingBottom: 15, 
    backgroundColor: "#fff", 
    alignItems: "center", 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0' 
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
  headerSub: { fontSize: 11, color: "#64748B", marginTop: 2 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 15, paddingBottom: 100 }, // Tab bar එකට ඉඩ තැබීම
  messageWrapper: { marginBottom: 12, width: '100%' },
  myMsgWrapper: { alignItems: 'flex-end' },
  otherMsgWrapper: { alignItems: 'flex-start' },
  messageBubble: { 
    maxWidth: '82%', 
    padding: 12, 
    borderRadius: 20, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 3 
  },
  myBubble: { backgroundColor: '#007AFF', borderBottomRightRadius: 2 },
  otherBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2 },
  msgHeader: { marginBottom: 3 },
  senderName: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  msgText: { fontSize: 15, color: '#334155', lineHeight: 20 },
  timeText: { fontSize: 9, marginTop: 4, alignSelf: 'flex-end' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#94A3B8', fontSize: 14 },
  inputContainer: { 
    flexDirection: 'row', 
    padding: 12, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0',
    paddingBottom: Platform.OS === 'android' ? 85 : 35 // මෙය Bottom Tab එකට උඩින් පෙන්වීමට උපකාරී වේ
  },
  input: { 
    flex: 1, 
    backgroundColor: '#F1F5F9', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    marginRight: 10, 
    maxHeight: 100, 
    fontSize: 15,
    color: '#1E293B'
  },
  sendBtn: { 
    backgroundColor: '#007AFF', 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  disabledSend: { backgroundColor: '#94A3B8' }
});