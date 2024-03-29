<template>
  <v-container class="sign-in">
    <v-form class="sign-in__form" ref="form">
      <h3>Sign in</h3>

      <h5 :show="!!error">
        {{ error }}
      </h5>

      <!-- Email -->
      <v-text-field
        v-model="email"
        type="email"
        prepend-icon="mdi-email"
        label="Email"
        :rules="[rules.emailRule]"
      ></v-text-field>

      <!-- Password -->
      <v-text-field
        v-model="password"
        type="password"
        label="Password"
        :rules="[rules.passwordRule]"
        prepend-icon="mdi-lock-outline"
        @keyup.enter="saveDataAndGet"
      ></v-text-field>

      <!-- Remember -->
      <v-checkbox
        v-model="remember"
        :true-value="1"
        :false-value="0"
        label="Remember me"
      ></v-checkbox>

      <!-- Social account -->
      <div class="sign-in__social-account">
        <a href="#" @click="googleAuth">Login using Google</a>
      </div>

      <!-- Buttons -->
      <v-row>
        <v-col>
          <v-btn @click.prevent="register">Register</v-btn>
        </v-col>
        <v-col>
          <v-btn class="btn--dark" @click="saveDataAndGet">Login</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import rulesMixin from "../mixins/rules-mixin";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../mixins/firebase-config";

export default {
  name: "SignIn",
  mixins: [rulesMixin, firebaseConfig],
  data() {
    return {
      email: "",
      password: "",
      remember: 0,
      error: null,
      twoLettersEmail: "",
    };
  },
  methods: {
    register() {
      this.$router.push("/register");
    },
    async saveDataAndGet() {
      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        this.twoLettersEmail = this.email.substring(0, 2);
        try {
          await this.$store.commit("setAvatarLabel", this.twoLettersEmail);
          await this.$store.dispatch("login", {
            email: this.email,
            password: this.password,
            remember: this.remember,
          });

          this.$router.replace("/to-do-directory");
        } catch (err) {
          this.error = err.message || "Failed to login, try again later";
        }
      }
    },
    async googleAuth() {
      this.$store.commit("setGoogleLogin", true);
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
  },
  mounted() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("remember");
    localStorage.removeItem("avatarLabel");
    localStorage.removeItem("googleLogin");
  },
};
</script>
