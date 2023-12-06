
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCiz5M2k3B8CS8jyQsq5OxR05Tlt9Fj48E",
    authDomain: "ppgeec-coder.firebaseapp.com",
    projectId: "ppgeec-coder",
    storageBucket: "ppgeec-coder.appspot.com",
    messagingSenderId: "810102363675",
    appId: "1:810102363675:web:643c402276f1a950944abe",
    measurementId: "G-KTCXND2NQY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();