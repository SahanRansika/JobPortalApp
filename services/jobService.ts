import { 
  addDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { db } from "./firebase";

// Collections සඳහා References
const jobsRef = collection(db, "jobs");
const applicationsRef = collection(db, "applications");

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

// 2. සියලුම Job ලබා ගැනීම (අලුත්ම ඒවා මුලට එන පරිදි)
export const getJobs = async () => {
  try {
    // createdAt අනුව sorting කිරීමට නම් Firebase index එකක් අවශ්‍ය විය හැක
    // දැනට සාමාන්‍ය ලබා ගැනීම:
    const snap = await getDocs(jobsRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting jobs: ", error);
    return [];
  }
};

// 3. Job එකකට Apply කිරීම (අලුතින් එකතු කළ කොටස)
export const applyForJob = async (applicationData: any) => {
  try {
    const docRef = await addDoc(applicationsRef, {
      ...applicationData,
      appliedAt: new Date().toISOString(), // Apply කළ වේලාව
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error applying for job: ", error);
    throw error;
  }
};

// 4. යම් පරිශීලකයෙක් Apply කළ ජොබ් පමණක් ලබා ගැනීම (පසුවට ප්‍රයෝජනවත් වේ)
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