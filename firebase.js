
import { initializeApp, getApps, getApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyCAB65EpRc45Wax1tJGtjXxCRGjdSlL54Y",
    authDomain: "chatapp-clone-3e1c6.firebaseapp.com",
    projectId: "chatapp-clone-3e1c6",
    storageBucket: "chatapp-clone-3e1c6.appspot.com",
    messagingSenderId: "321086629286",
    appId: "1:321086629286:web:f4f4d4e428bdb5e7b99b67"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();