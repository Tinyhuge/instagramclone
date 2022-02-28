import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDZIaFeauTOGwHpeaPFdELB4Y7K2QBd9VI",
  authDomain: "instagram-clone-65d8c.firebaseapp.com",
  projectId: "instagram-clone-65d8c",
  storageBucket: "instagram-clone-65d8c.appspot.com",
  messagingSenderId: "1039199279598",
  appId: "1:1039199279598:web:62ce10a4869c1c3563d6ff",
  measurementId: "G-N7VNNW8SGR",
});

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const analytics = getAnalytics(firebaseApp);

export { db, auth, storage };
