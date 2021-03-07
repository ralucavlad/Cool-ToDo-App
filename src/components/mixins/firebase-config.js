import firebase from "firebase/app";
import "firebase/database";

export default {
  created() {
    const config = {
      apiKey: "AIzaSyDreeyGJwE6UajgYbcUpVZlAoFNOcSWlYw",
      authDomain: "my-cool-todo-ac29b.firebaseapp.com",
      databaseURL:
        "https://my-cool-todo-ac29b-default-rtdb.europe-west1.firebasedatabase.app",
      storageBucket: "my-cool-todo-ac29b.appspot.com",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      firebase.app();
    }
  },
};
