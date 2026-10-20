const firebaseConfig = {
  apiKey: "AIzaSyAQ2O-GN64yaXVGlbsNgc542K8Hg99y8qo",
  authDomain: "pulse-blog-app.firebaseapp.com",
  projectId: "pulse-blog-app",
  storageBucket: "pulse-blog-app.firebasestorage.app",
  messagingSenderId: "816306045341",
  appId: "1:816306045341:web:6ed4433fec9e2be1ec2f74"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

//I vereified that firebase auth initializes correctly before building any forms,"
//console.log("Firebase setup complete. Auth object:", auth);