import firebase from "firebase/app";
import "firebase/storage";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCiBmmpjNuM-hzQ8kG1xjl5IQpeBiFH0EA",
  authDomain: "try-tf-ca16d.firebaseapp.com",
  databaseURL: "https://try-tf-ca16d.firebaseio.com",
  projectId: "try-tf-ca16d",
  storageBucket: "try-tf-ca16d.appspot.com",
  messagingSenderId: "987750036537",
  appId: "1:987750036537:web:ae2fac93faa048c52bc9e8",
  measurementId: "G-ZMH51ZK956",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const FirebaseFactory = () => {
  const storage = firebase.storage();
  return {
    storage,
  };
};

export default FirebaseFactory();
