import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4KLP_dHwIP9v1z7KQ47rIXe5AUKQhAkw",
  authDomain: "d-dragon-app.firebaseapp.com",
  projectId: "d-dragon-app",
  storageBucket: "d-dragon-app.firebasestorage.app",
  messagingSenderId: "615092260182",
  appId: "1:615092260182:web:c030280ab4bef2e3d8daf7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
