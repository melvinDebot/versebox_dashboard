import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAhFb1q-qHs-wAkscvMH6oe-aUxbpbNlW8",
  authDomain: "platech-bdd.firebaseapp.com",
  databaseURL:
    "https://platech-bdd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "platech-bdd",
  storageBucket: "platech-bdd.appspot.com",
  messagingSenderId: "803202564105",
  appId: "1:803202564105:web:51470d3f3b0fb82130b8d8",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // const name = result.user.displayName;
      // const email = result.user.email;
      // const profilePic = result.user.photoURL;
      console.log(result.user);
    })
    .catch((error) => {
      console.log(error);
    });
};

const messaging = getMessaging(app);

export const fetchToken = (setTokenFound) => {
  return getToken(messaging, {
    vapidKey:
      "BO1rSIwdoXE4S9WVYDVWFLVWsZZG-BUqF4wIpyimuURV5T_Ex5L4vEj8HjkA095fokh6eV8XaL6ucEYdX3vbOl0",
  })
    .then((currentToken) => {
      if (currentToken) {
        const user = JSON.parse(localStorage.getItem("user"));
        const userData = auth.currentUser;
        const uid = userData?.uid || user?.uuidUser;
        setTokenFound(true);

        if (user !== null) {
          if (Object.keys(user).length > 0) {
            console.log(
              `GET TOKEN NOTIFICATION: /users/${user.uuidUser}/user/tokenPush/`,
              currentToken,
              uid
            );
            // update(ref(db, `/users/${uid}/user/`), {
            //   token: currentToken,
            // });
          }
          // Track the token -> client mapping, by sending to backend server
          // show on the UI that permission is secured
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
          setTokenFound(false);
          // shows on the UI that permission is required
        }
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
