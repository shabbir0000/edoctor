// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { ref } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXXWkMMj-YATC00D0zL4YfkYhIAlAhXts",
  authDomain: "edoctor-913c3.firebaseapp.com",
  projectId: "edoctor-913c3",
  storageBucket: "edoctor-913c3.appspot.com",
  messagingSenderId: "1091481121627",
  appId: "1:1091481121627:web:7401a2f0d0cf064d25207e"
};




// Initialize Firebase
export const app = initializeApp(firebaseConfig,{
    experimentalForceLongPolling: true
    })

  export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
    })

  export const auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });

export const ref1 = ref;
// export const authh = auth;
export const storage = getStorage(app);