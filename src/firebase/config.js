import { initializeApp } from 'firebase/app';

// import { getAnalytics } from 'firebase/analytics';
import { getAuth, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCz82OzhfcADVUTHnEJgNkcy0eFU4K03O0',
    authDomain: 'movie-c440c.firebaseapp.com',
    projectId: 'movie-c440c',
    storageBucket: 'movie-c440c.appspot.com',
    messagingSenderId: '1025271130263',
    appId: '1:1025271130263:web:48babbb9328a39da0361d2',
    measurementId: 'G-1LLZLW57QS',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const fbProvider = new FacebookAuthProvider();
