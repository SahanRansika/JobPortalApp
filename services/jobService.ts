import { 
  addDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Collections References
const jobsRef = collection(db, "jobs");
const applicationsRef = collection(db, "applications");
const usersRef = collection(db, "users");
const feedbacksRef = collection(db, "feedbacks");

// --- 1. File Upload (CV) ---
export const uploadCV = async (uri: string, fileName: string) => {
  const data = new FormData();
  data.append('file', {
    uri: uri,
    type: 'application/pdf', 
    name: fileName,
  } as any);
  
  data.append('upload_preset', 'jobportal'); 
  data.append('resource_type', 'raw'); 

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dt2xaqo32/raw/upload', {
      method: 'POST',
      body: data,
    });
    
    const file = await res.json();
    
    if (file.secure_url) {
      return file.secure_url; 
    } else {
      throw new Error("Cloudinary upload failed");
    }
  } catch (error) {
    console.error("Cloudinary CV Upload Error: ", error);
    throw error;
  }
};

// --- 2. Job කළමනාකරණය ---
export const addJob = async (job: any) => {
  try {
    const docRef = await addDoc(jobsRef, {
      ...job,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) { throw error; }
};

export const updateJob = async (jobId: string, updatedData: any) => {
  try {
    const jobDoc = doc(db, "jobs", jobId);
    await updateDoc(jobDoc, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) { throw error; }
};

export const getJobs = async () => {
  try {
    const q = query(jobsRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) { return []; }
};

export const deleteJob = async (jobId: string) => {
  try {
    await deleteDoc(doc(db, "jobs", jobId));
    return { success: true };
  } catch (error) { throw error; }
};

// --- 3. Applications ---
export const applyForJob = async (applicationData: any) => {
  try {
    const docRef = await addDoc(applicationsRef, {
      ...applicationData,
      appliedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) { throw error; }
};

export const updateApplicationStatus = async (appId: string, newStatus: string) => {
  try {
    const appDoc = doc(db, "applications", appId);
    await updateDoc(appDoc, { status: newStatus });
    return { success: true };
  } catch (error) { throw error; }
};

export const getApplicationsForJob = async (jobId: string) => {
  try {
    const q = query(applicationsRef, where("jobId", "==", jobId), orderBy("appliedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) { return []; }
};

// --- 4. User Profile & Admin Management ---

// සාමාන්‍ය Profile update කිරීම (merge: true නිසා තියෙන data මැකෙන්නේ නැත)
export const saveUserProfile = async (userId: string, userData: any) => {
  try {
    const userDoc = doc(db, "users", userId);
    await setDoc(userDoc, userData, { merge: true });
    return { success: true };
  } catch (error) { throw error; }
};

// User කෙනෙකුගේ Role එක (Admin/Recruiter/User) update කිරීම
export const updateUserRole = async (userId: string, targetRole: string) => {
  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, { role: targetRole });
    return { success: true };
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

// User කෙනෙකුගේ විස්තර Admin විසින් edit කිරීම
export const updateUserDetails = async (userId: string, newName: string, newEmail: string) => {
  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, {
      username: newName,
      email: newEmail,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

// User කෙනෙකු Firestore එකෙන් ඉවත් කිරීම
export const deleteUser = async (userId: string) => {
  try {
    const userDoc = doc(db, "users", userId);
    await deleteDoc(userDoc);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};


// Feedback යැවීම
export const sendFeedback = async (text: string, userData: any) => {
  try {
    // සටහන: මෙහි collection(db, "feedbacks") ලෙස කෙලින්ම යෙදිය හැක 
    // නැතිනම් ඔබ උඩින් define කර ඇති feedbacksRef පාවිච්චි කළ හැක.
    await addDoc(feedbacksRef, {
      text: text,
      userId: userData.uid, // FeedbackPage එකේ 'item.userId' ලෙස පාවිච්චි කරන නිසා මෙය 'userId' විය යුතුයි
      username: userData.username,
      role: userData.role,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error sending feedback:", error);
    throw error;
  }
};

// Feedback මැකීම (මෙය අනිවාර්යයෙන්ම තිබිය යුතුයි)
export const deleteFeedback = async (feedbackId: string) => {
  try {
    const docRef = doc(db, "feedbacks", feedbackId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
};
