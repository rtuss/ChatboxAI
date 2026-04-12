// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcKIOvOsVUSN3uh5TvgpC5teWEthyrhHw",
  authDomain: "nhanhtravel-website.firebaseapp.com",
  databaseURL: "https://nhanhtravel-website-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nhanhtravel-website",
  storageBucket: "nhanhtravel-website.firebasestorage.app",
  messagingSenderId: "164568911436",
  appId: "1:164568911436:web:f3dc16b8232df1cdf52ee9",
  measurementId: "G-B5VR4MNQ6Q"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);  // Lấy reference tới Realtime Database

// Export database để có thể sử dụng ở file khác
export { database }; 