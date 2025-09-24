import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  sendEmailVerification,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  increment,
  where,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

export const db = getFirestore(app);
export const storage = getStorage(app);

export const uploadThumbnail = async (file, uid) => {
  if (!file) return null;
  const fileRef = ref(
    storage,
    `users/${uid}/thumbnails/${Date.now()}_${file.name}`
  );
  const snap = await uploadBytes(fileRef, file);
  return getDownloadURL(snap.ref);
};

export const uploadVideo = async (file, uid) => {
  if (!file) return;
  const fileRef = ref(
    storage,
    `users/${uid}/videos/${Date.now()}_${file.name}`
  );
  const task = uploadBytesResumable(fileRef, file);

  await new Promise((resolve, reject) => {
    task.on("state_changed", undefined, reject, resolve);
  });

  return getDownloadURL(task.snapshot.ref);
};

export const createTutorialDocFromData = async (tutorialData) => {
  if (!tutorialData) return;

  const tutorialDocRef = doc(collection(db, "tutorials"));

  const { title, videoUrl, thumbnailUrl, uploaderUid, uploaderName } =
    tutorialData;
  const createdAt = new Date();

  try {
    await setDoc(tutorialDocRef, {
      title,
      videoUrl,
      thumbnailUrl,
      uploaderUid,
      uploaderName,
      views: 0,
      ratingsCount: 0,
      ratingsSum: 0,
      createdAt,
    });
  } catch (error) {
    console.log("error in creating ", error.message);
  }

  return tutorialDocRef;
};

export const fetchTutorialsAndDocuments = () => {
  const collectionRef = collection(db, "tutorials");
  const q = query(collectionRef, orderBy("createdAt", "desc"));
  return q;
};

export const deleteTutorialDocById = async (tutorialId) => {
  if (!tutorialId) return;

  const tutorialDocRef = doc(db, "tutorials", tutorialId);

  try {
    await deleteDoc(tutorialDocRef);
  } catch (error) {
    console.log("error in deleting ", error.message);
  }

  return tutorialDocRef;
};

export const incrementTutorialViews = async (tutorialId) => {
  if (!tutorialId) return;

  const tutorialDocRef = doc(db, "tutorials", tutorialId);

  try {
    await updateDoc(tutorialDocRef, { views: increment(1) });
  } catch (error) {
    console.log("error in incrementing view ", error.message);
  }

  return tutorialDocRef;
};

export const hasUserReviewed = async (tutorialId, uid) => {
  if (!tutorialId || !uid) return false;
  const ratingRef = doc(db, "tutorials", tutorialId, "ratings", uid);
  const snap = await getDoc(ratingRef);
  return snap.exists();
};

export const addTutorialRating = async (tutorialId, uid, stars) => {
  if (!tutorialId || !uid || !stars) return null;

  const ratingRef = doc(db, "tutorials", tutorialId, "ratings", uid);
  const tutorialRef = doc(db, "tutorials", tutorialId);

  // If already reviewed, stop immediately
  const existing = await getDoc(ratingRef);
  if (existing.exists()) return null;

  // Create user rating doc
  await setDoc(ratingRef, {
    uid,
    stars,
    createdAt: new Date(),
  });

  // Update aggregates
  await updateDoc(tutorialRef, {
    ratingsCount: increment(1),
    ratingsSum: increment(stars),
  });

  return { ok: true };
};

export const createUserDocFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error in creating ", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signinAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

const SITE_URL = import.meta.env.VITE_SITE_URL;
export const resetPassword = async (email) => {
  if (!email) return;
  await sendPasswordResetEmail(auth, email, {
    url: `${SITE_URL}/login`,
  });
};

export const sendVerificationEmail = async (user) => {
  if (!user) return;
  await sendEmailVerification(user, {
    url: `${SITE_URL}/otp`,
  });
};

export async function userExistsByEmail(email) {
  const q = query(
    collection(db, "users"),
    where("email", "==", email.toLowerCase())
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export const verifyResetCode = (oobCode) => {
  return verifyPasswordResetCode(auth, oobCode);
};

export const confirmResetPassword = (oobCode, newPassword) => {
  return confirmPasswordReset(auth, oobCode, newPassword);
};
