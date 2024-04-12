// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyD4rlSqFrPwqIbQxLtBhYd8m0wuBvhQ4xI',
    authDomain: 'react-native-ys.firebaseapp.com',
    projectId: 'react-native-ys',
    storageBucket: 'react-native-ys.appspot.com',
    messagingSenderId: '555653275228',
    appId: '1:555653275228:web:881c5eb096d99288f09099',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, storage };
