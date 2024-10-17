// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
const auth = getAuth(app);

// Export auth for use in other parts of the app
export { auth };