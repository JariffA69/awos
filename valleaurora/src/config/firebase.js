// src/config/firebase.js
import { initializeApp} from 'firebase/app'
import { getFirestore} from 'firebase/firestore'

// REEMPLAZA estos valores con las credenciales de tu consola de Firestore
const firebaseConfig = {
    apikey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)