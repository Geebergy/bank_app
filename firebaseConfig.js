// firebaseConfig.js
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC5A6JZsfio5lMm2VC_0lwlWQTdnC_0o1I",
  authDomain: "broker-81de0.firebaseapp.com",
  projectId: "broker-81de0",
  storageBucket: "broker-81de0.appspot.com",
  messagingSenderId: "348513278140",
  appId: "1:348513278140:web:2f8b2560a87bcc801c18b9",
  measurementId: "G-NSD8XPBP38"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);



export { firebase, storage };
