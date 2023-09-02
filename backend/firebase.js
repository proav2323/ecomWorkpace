
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyB_TZrhyY_KpGUSiTjelBAV9bv2J1ohfTg",
  authDomain: "ecomapp-3f233.firebaseapp.com",
  projectId: "ecomapp-3f233",
  storageBucket: "ecomapp-3f233.appspot.com",
  messagingSenderId: "967230489615",
  appId: "1:967230489615:web:7f77c7cedc7003b3478f7a",
  measurementId: "G-4WCRJ3Z9H8"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
