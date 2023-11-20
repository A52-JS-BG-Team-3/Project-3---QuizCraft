import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8asxoTkEGvtBMroclyXSEaKY_98CnSU8",
  authDomain: "quizcraft-948dd.firebaseapp.com",
  projectId: "quizcraft-948dd",
  storageBucket: "quizcraft-948dd.appspot.com",
  messagingSenderId: "4009445663",
  appId: "1:4009445663:web:2a18ef25d8303c567b482a",
  databaseURL: "https://quizcraft-948dd-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);