// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCzLP6oM0rLELWsJHu7SxUrIUFzM_rK0l8",
    authDomain: "cha-de-casa-aa423.firebaseapp.com",
    databaseURL: "https://cha-de-casa-aa423-default-rtdb.firebaseio.com",
    projectId: "cha-de-casa-aa423",
    storageBucket: "cha-de-casa-aa423.appspot.com",
    messagingSenderId: "155068739488",
    appId: "1:155068739488:web:a0f834fa0dac8409c4bec5",
    measurementId: "G-DCG7VW95FW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
