import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCs9vqd94D-rXQ2uy83aAGd0mWb0xcgM28",
  authDomain: "accessibility-ai-app.firebaseapp.com",
  projectId: "accessibility-ai-app",
  storageBucket: "accessibility-ai-app.firebasestorage.app",
  messagingSenderId: "737029341375",
  appId: "1:737029341375:web:2ee8ff5d0eac0fdb8fc60a",
  measurementId: "G-CBTWSNMPMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
