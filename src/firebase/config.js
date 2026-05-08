// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANLFWSJQCY7xsEbcGCfCaEDZFhhTAcsf4",
  authDomain: "eventosapp-1016a.firebaseapp.com",
  projectId: "eventosapp-1016a",
  storageBucket: "eventosapp-1016a.firebasestorage.app",
  messagingSenderId: "57652206203",
  appId: "1:57652206203:web:4b6768dacfb9f21386a0de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});