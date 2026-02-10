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
} from "firebase/firestore";
import { db } from "./firebase";

const jobsRef = collection(db, "jobs");
const applicationsRef = collection(db, "applications");
const usersRef = collection(db, "users");
const feedbacksRef = collection(db, "feedbacks");

// --- 1. File Upload (CV) - Using Cloudinary for PDF ---
export const uploadCV = async (uri: string, fileName: string) => {
  const data = new FormData();
  data.append('file', {
    uri: uri,
    type: 'application/pdf', 
    name: fileName,
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
  } catch (error) {
    console.error("Cloudinary CV Upload Error: ", error);
    throw error;
  }
};

// --- 2. Job කළමනාකරණය ---
export const addJob = async (job: any) => {
  try {
    const docRef = await addDoc(jobsRef, job);
    return docRef.id;
  } catch (error) { throw error; }
};

export const getJobs = async () => {
  try {
    const q = query(jobsRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) { 
    console.error("Error fetching jobs:", error);
    return []; 
  }
};

// --- ADDED: Recruiter කෙනෙක් පලකරපු Jobs පමණක් ලබා ගැනීම ---
export const getJobsByRecruiter = async (recruiterId: string) => {
  try {
    const q = query(jobsRef, where("postedBy", "==", recruiterId), orderBy("createdAt", "desc"));
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

// --- 3. Applications (රැකියා අයදුම්පත්) ---

export const applyForJob = async (applicationData: {
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicantEmail: string | null;
  applicantName: string;
  applicantId: string; // <-- මෙය අනිවාර්යයෙන් එක් කරන්න
  cvUrl: string;
  status: string;
  recruiterId: string;
}) => {
  try {
    if (!applicationData.recruiterId) throw new Error("Recruiter ID missing");
    
    const docRef = await addDoc(applicationsRef, {
      ...applicationData,
      appliedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error applying:", error);
    throw error;
  }
};

// එක ජොබ් එකකට අදාළ අයදුම්පත්
export const getApplicationsForJob = async (jobId: string) => {
  try {
    const q = query(applicationsRef, where("jobId", "==", jobId), orderBy("appliedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) { return []; }
};

// --- ADDED: Recruiter කෙනෙක්ට ලැබුණු සියලුම Applications (Inbox එක සඳහා) ---
export const getApplicationsForRecruiter = async (recruiterId: string) => {
  try {
    const q = query(applicationsRef, where("recruiterId", "==", recruiterId), orderBy("appliedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) { 
    console.error("Inbox fetch error:", error);
    return []; 
  }
};

// --- ADDED: Job Seeker කෙනෙක් Apply කරපු පෝස්ට් බලාගන්න (My Applications) ---
export const getMyApplications = async (userId: string) => {
  try {
    const q = query(applicationsRef, where("applicantId", "==", userId), orderBy("appliedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) { return []; }
};

export const updateApplicationStatus = async (appId: string, newStatus: string) => {
  try {
    const appDoc = doc(db, "applications", appId);
    await updateDoc(appDoc, { status: newStatus });
    return { success: true };
  } catch (error) { throw error; }
};

// --- 4. පරිශීලක කළමනාකරණය සහ Feedback (කලින් තිබූ ලෙසම...) ---
// (කේතය කෙටි කිරීමට මෙහි පෙන්වන්නේ නැත, නමුත් ඔබේ file එකේ තිබිය යුතුය)