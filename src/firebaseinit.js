// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5HQ8mTntNf36EkapiXsM0Zyfc63Sq7a8",
  authDomain: "blog-app-5cfab.firebaseapp.com",
  projectId: "blog-app-5cfab",
  storageBucket: "blog-app-5cfab.appspot.com",
  messagingSenderId: "969533910864",
  appId: "1:969533910864:web:4d4aa7544903a3800f4655"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export & Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);