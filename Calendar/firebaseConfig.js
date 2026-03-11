import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 방금 알려주신 정확한 키값으로 수정했습니다!
const firebaseConfig = {
  apiKey: "AIzaSyB4KLP_dHwIP9v1z7KQ47rIXe5AUKQhAkw", // 여기가 수정되었습니다.
  authDomain: "d-dragon-app.firebaseapp.com",
  projectId: "d-dragon-app",
  storageBucket: "d-dragon-app.firebasestorage.app",
  messagingSenderId: "615092260182",
  appId: "1:615092260182:web:c030280ab4bef2e3d8daf7",
  measurementId: "G-HS48TLXQR9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);