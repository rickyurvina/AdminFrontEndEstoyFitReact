import firebase from 'firebase';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyA9W8brJo2gs0zpQtPU_jNDg4X1Tn_X1Lc",
  authDomain: "proconty-gym.firebaseapp.com",
  databaseURL: "https://proconty-gym.firebaseio.com",
  projectId: "proconty-gym",
  storageBucket: "proconty-gym.appspot.com",
  messagingSenderId: "1072764516395",
  appId: "1:1072764516395:web:78ffb480e2ddb4ce2d126e",
  measurementId: "G-NYG97YFX6Z"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const storage = firebase.storage();
const auth = firebase.auth();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

const database = firebase.database();
export {
  storage,
  auth,
  database,
  googleAuthProvider,
  githubAuthProvider,
  facebookAuthProvider,
  twitterAuthProvider
};

