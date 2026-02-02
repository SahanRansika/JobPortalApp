import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const jobsRef = collection(db, "jobs");

export const addJob = async (job: any) => {
  await addDoc(jobsRef, job);
};

export const getJobs = async () => {
  const snap = await getDocs(jobsRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
