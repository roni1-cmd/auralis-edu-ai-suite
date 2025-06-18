
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAjhNgYvGYtmM-QtjsN_VhU8u9ILiPqW9M",
  authDomain: "auralis-7ba3c.firebaseapp.com",
  projectId: "auralis-7ba3c",
  storageBucket: "auralis-7ba3c.firebasestorage.app",
  messagingSenderId: "168814384926",
  appId: "1:168814384926:web:fa6fb8a74ae2a4f0c75b0f",
  measurementId: "G-06NWD0ZEYB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

export default app;
