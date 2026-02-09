import { 
  addDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  doc 
} from "firebase/firestore";
import { db } from "./firebase";

// Collections සඳහා References
const jobsRef = collection(db, "jobs");
const applicationsRef = collection(db, "applications");
const usersRef = collection(db, "users");

// 1. අලුත් Job එකක් ඇතුළත් කිරීම
export const addJob = async (job: any) => {
  try {
    const docRef = await addDoc(jobsRef, job);
    return docRef.id;
  } catch (error) {
    console.error("Error adding job: ", error);
    throw error;
  }
};

// 2. සියලුම Job ලබා ගැනීම
export const getJobs = async () => {
  try {
    const snap = await getDocs(jobsRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting jobs: ", error);
    return [];
  }
};

// 3. Job එකකට Apply කිරීම
export const applyForJob = async (applicationData: any) => {
  try {
    const docRef = await addDoc(applicationsRef, {
      ...applicationData,
      appliedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error applying for job: ", error);
    throw error;
  }
};

// 4. යම් පරිශීලකයෙක් Apply කළ ජොබ් ලබා ගැනීම
export const getMyApplications = async (userEmail: string) => {
  try {
    const q = query(applicationsRef, where("applicantEmail", "==", userEmail));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting applications: ", error);
    return [];
  }
};

// 5. සියලුම සාමාන්‍ය පරිශීලකයින් (Job Seekers) ලබා ගැනීම
export const getAllUsers = async () => {
  try {
    // role එක "user" වන අය පමණක් fetch කරයි
    const q = query(usersRef, where("role", "==", "user"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// 6. User ID එක මගින් පරිශීලකයෙකු Recruiter ලෙස උසස් කිරීම
export const promoteToRecruiter = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      role: "recruiter"
    });
    return { success: true };
  } catch (error) {
    console.error("Error promoting user:", error);
    throw error;
  }
};

// (කලින් තිබූ Email මගින් සොයන function එකද අවශ්‍ය නම් තබා ගත හැක)
export const makeRecruiter = async (email: string) => {
  try {
    const q = query(usersRef, where("email", "==", email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw new Error("User not found.");
    const userDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, "users", userDoc.id), { role: "recruiter" });
    return { success: true };
  } catch (error: any) {
    throw error;
  }
};