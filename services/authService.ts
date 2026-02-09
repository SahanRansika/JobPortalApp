import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";


export const login = (email:string, password:string) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const registerUser =async (
    fullName:string,
    email:string,
    password:string
) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    await updateProfile(userCredential.user,{displayName:fullName})
    await setDoc(doc(db, "users", userCredential.user.uid), {
        name: fullName,
        role: "",
        email,
        createAt: new Date()
    })
    return userCredential.user;
    }
