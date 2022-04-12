// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAQMrHBd8ln1-3asayuyWhm1d3NLXJUJds',
  authDomain: 'house-marketplace-93edf.firebaseapp.com',
  projectId: 'house-marketplace-93edf',
  storageBucket: 'house-marketplace-93edf.appspot.com',
  messagingSenderId: '294458237167',
  appId: '1:294458237167:web:0350f68acde75a3622bb1a',
  measurementId: 'G-PYBSJ8E6WW'
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
