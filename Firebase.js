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
  apiKey: "AIzaSyC_zvlxN2EzGJ1eo5VKk-nYyMZ2ki_BrWU",
  authDomain: "deefelzz.firebaseapp.com",
  projectId: "deefelzz",
  storageBucket: "deefelzz.appspot.com",
  messagingSenderId: "673709718349",
  appId: "1:673709718349:web:69ca9934a02377b5e99504"
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