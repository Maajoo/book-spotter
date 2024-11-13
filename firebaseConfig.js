// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU723wKEOy13usnoKXqDA56ADotLlr_8g",
  authDomain: "book-spotter.firebaseapp.com",
  projectId: "book-spotter",
  storageBucket: "book-spotter.appspot.com",
  messagingSenderId: "341341636026",
  appId: "1:341341636026:web:86382b1a7b37ed077c4983"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase authentication
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firebase Firestore Database
const db = getFirestore(app)

// Export auth for use in other parts of the app
export { auth, db };