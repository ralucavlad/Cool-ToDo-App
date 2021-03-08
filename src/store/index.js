import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(Vuex);

let timer;

export default new Vuex.Store({
  state() {
    return {
      token: null,
      userId: null,
      rememberMe: 0,
      autoLoggedOut: null,
      taskOpened: null,
      avatarLabel: null,
      googleLogin: null,
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.autoLoggedOut = false;
    },
    setRememberMe(state, payload) {
      state.rememberMe = payload;
    },
    autoLoggedOut(state) {
      state.autoLoggedOut = true;
    },
    setTaskOpened(state, payload) {
      state.taskOpened = payload;
    },
    setAvatarLabel(state, payload) {
      state.avatarLabel = payload;
      localStorage.setItem("avatarLabel", payload);
    },
    setGoogleLogin(state, payload) {
      state.googleLogin = payload;
      localStorage.setItem("googleLogin", payload);
    },
  },
  actions: {
    async login(context, payload) {
      return context.dispatch("auth", {
        ...payload,
        mode: "login",
      });
    },
    async register(context, payload) {
      return context.dispatch("auth", {
        ...payload,
        mode: "register",
      });
    },
    async auth(context, payload) {
      const mode = payload.mode;
      let url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDreeyGJwE6UajgYbcUpVZlAoFNOcSWlYw";

      if (mode === "register") {
        url =
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDreeyGJwE6UajgYbcUpVZlAoFNOcSWlYw";
      }
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = "";

        if (mode === "register") {
          if (responseData.error.message === "EMAIL_EXISTS") {
            errorMessage = "Failed to authenticate. Email already exists!";
          }
        } else if (mode === "login") {
          if (responseData.error.message === "EMAIL_NOT_FOUND") {
            errorMessage = "Failed to login. Email not found!";
          } else if (responseData.error.message === "INVALID_PASSWORD") {
            errorMessage = "Failed to login. Invalid password!";
          }
        }

        const error = new Error(errorMessage || "Failed to authenticate.");
        throw error;
      }

      //calc expiration date
      const expiresIn = Number(responseData.expiresIn * 1000);
      const expirationDate = new Date().getTime() + expiresIn;

      // for auto login, store in local storage first
      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);
      localStorage.setItem("tokenExpiration", expirationDate);
      localStorage.setItem("remember", payload.remember);

      timer = setTimeout(function() {
        context.dispatch("autoLogout");
      }, expiresIn);

      context.commit("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
      });
    },
    autoLogin(context) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      const remember = localStorage.getItem("remember");

      const expiresIn = Number(tokenExpiration - new Date().getTime());
      if (expiresIn < 0 || Number(remember) === 0) {
        return;
      }

      timer = setTimeout(function() {
        context.dispatch("autoLogout");
      }, expiresIn);

      if (token && userId) {
        context.commit("setUser", {
          token: token,
          userId: userId,
        });
      }
    },
    loginGoogle(context) {
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

      firebase
        .auth()
        .getRedirectResult()
        .then((result) => {
          const credential = result.credential;
          const token = credential.accessToken;
          const userEmail = result.user.email;
          const userId = result.user.uid;
          const passData = [userEmail, userId, token];
          return passData;
        })
        .then((user) => {
          const expirationDate = new Date().getTime() + 3600 * 1000;
          localStorage.setItem("tokenExpiration", expirationDate);

          timer = setTimeout(function() {
            context.dispatch("autoLogout");
          }, 3600 * 1000);

          localStorage.setItem("userId", user[1]);
          localStorage.setItem("token", user[2]);
          context.commit("setUser", {
            token: user[2],
            userId: user[1],
          });
          context.commit("setAvatarLabel", user[0].substring(0, 2));
          return true;
        })
        .then(() => {
          context.commit("setGoogleLogin", false);
        })
        .catch((error) => {
          const thrError = new Error(
            error.message || "Failed to authenticate."
          );
          throw thrError;
        });
    },
    logout(context) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("remember");
      localStorage.removeItem("avatarLabel");
      localStorage.removeItem("googleLogin");

      clearTimeout(timer);

      context.commit("setUser", {
        token: null,
        userId: null,
      });
    },
    autoLogout(context) {
      context.dispatch("logout");
      context.commit("autoLoggedOut");
    },
  },
  getters: {
    token(state) {
      return state.token;
    },
    userId(state) {
      return state.userId;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
    autoLoggedOut(state) {
      return state.autoLoggedOut;
    },
    taskOpened(state) {
      return state.taskOpened;
    },
    rememberMe(state) {
      return state.rememberMe;
    },
    avatarLabel(state) {
      if (localStorage.getItem("avatarLabel")) {
        state.avatarLabel = localStorage.getItem("avatarLabel");
      }
      return state.avatarLabel;
    },
    getGoogleLogin(state) {
      if (localStorage.getItem("googleLogin")) {
        state.googleLogin = localStorage.getItem("googleLogin");
      }
      return state.googleLogin;
    },
  },
});
