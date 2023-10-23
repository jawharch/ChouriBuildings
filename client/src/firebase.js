// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:"AIzaSyA7VTmhLs7PYayzP7wKxpoglDb10hnUhBc",
  authDomain: "mearn-estate.firebaseapp.com",
  projectId: "mearn-estate",
  storageBucket: "mearn-estate.appspot.com",
  messagingSenderId: "1024297045517",
  appId: "1:1024297045517:web:5e9dad446c09ee58bccf44"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);