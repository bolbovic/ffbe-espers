import Firebase from 'firebase';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STOCKAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

const app = Firebase.initializeApp(config);

export const FirebaseAuth = app.auth();
export const EmailAuthProvider = Firebase.auth.EmailAuthProvider;
export const DatabaseRef = app.database().ref();
export const StorageRef = app.storage().ref();
export const StorageImagesRef = StorageRef.child('images');
export const Config = config;

export default {
  Config,
  DatabaseRef,
  EmailAuthProvider,
  FirebaseAuth,
  StorageImagesRef,
  StorageRef
};
