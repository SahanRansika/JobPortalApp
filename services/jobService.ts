import { 
  addDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  doc,
  deleteDoc 
} from "firebase/firestore";
import { db } from "./firebase";

// Collections සඳහා References
const jobsRef = collection(db, "jobs");
const applicationsRef = collection(db, "applications");
const usersRef = collection(db, "users");
const feedbacksRef = collection(db, "feedbacks");

// --- 1. Job කළමනාකරණය ---

export const addJob = async (job: any) => {
  try {
    const docRef = await addDoc(jobsRef, job);
    return docRef.id;
  } catch (error) { throw error; }
};

export const getJobs = async () => {
  try {
    const snap = await getDocs(jobsRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) { return []; }
};

// --- 2. පරිශීලක කළමනාකරණය (Admin & Profile) ---

/**
 * පරිශීලකයාගේ මූලික විස්තර Update කිරීම (Admin Panel සහ Profile Page සඳහා)
 */
export const updateUserDetails = async (userId: string, newUsername: string, newEmail: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      username: newUsername,
      email: newEmail.toLowerCase().trim()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

/**
 * ඕනෑම පරිශීලකයෙකුගේ Role එක Update කිරීම (Admin Only)
 */
export const updateUserRole = async (userId: string, newRole: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { role: newRole });
    return { success: true };
  } catch (error) { throw error; }
};

/**
 * පරිශීලකයෙකු ඉවත් කිරීම (Admin Only)
 */
export const deleteUser = async (userId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    return { success: true };
  } catch (error) { throw error; }
};

export const getAllUsers = async () => {
  try {
    const q = query(usersRef, where("role", "==", "user"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) { return []; }
};

export const getAllRecruiters = async () => {
  try {
    const q = query(usersRef, where("role", "==", "recruiter"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) { return []; }
};

// --- 3. Feedback & Community Functions ---

/**
 * නව Feedback පණිවිඩයක් ඇතුළත් කිරීම
 * (TypeScript error එක වැළැක්වීමට uid: string | undefined ලෙස සකසා ඇත)
 */
export const sendFeedback = async (
  message: string, 
  userData: { uid: string | undefined, username: string, role: string }
) => {
  // UID එක නැතිනම් error එකක් throw කිරීම මගින් ආරක්ෂාව තහවුරු කරයි
  if (!userData.uid) {
    throw new Error("User must be logged in to send feedback.");
  }

  try {
    const docRef = await addDoc(feedbacksRef, {
      text: message,
      userId: userData.uid,
      username: userData.username,
      role: userData.role,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error sending feedback:", error);
    throw error;
  }
};

/**
 * Feedback පණිවිඩයක් මකා දැමීම (Admin Only)
 */
export const deleteFeedback = async (feedbackId: string) => {
  try {
    await deleteDoc(doc(db, "feedbacks", feedbackId));
    return { success: true };
  } catch (error) { throw error; }
};