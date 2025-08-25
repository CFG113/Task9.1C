// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChRYLpIRWMMWoZObdvadhx-isTMxcwfuQ",
  authDomain: "deakin-app-hd.firebaseapp.com",
  projectId: "deakin-app-hd",
  storageBucket: "deakin-app-hd.firebasestorage.app",
  messagingSenderId: "374016924303",
  appId: "1:374016924303:web:b4e4ae3beeb2db650b2efa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
