// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBCHnvxNhff97gMKB6pys9Mdxh62OKa6_s",
    authDomain: "theeditlab-f3e24.firebaseapp.com",
    projectId: "theeditlab-f3e24",
    storageBucket: "theeditlab-f3e24.firebasestorage.app",
    messagingSenderId: "437693927644",
    appId: "1:437693927644:web:05327c152e9dff8be86419"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };