<template>
  <v-container class="register">
    <v-form class="register__form" ref="form">
      <h3>Register</h3>

      <h5 :show="!!error">
        {{ error }}
      </h5>

      <v-row>
        <v-col cols="12" sm="6">
          <!-- Username -->
          <v-text-field
            v-model="username"
            prepend-icon="mdi-face"
            label="Username"
            :rules="[rules.userRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <!-- Email -->
          <v-text-field
            v-model="email"
            type="email"
            prepend-icon="mdi-email"
            label="Email"
            :rules="[rules.emailRule]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <!-- Password -->
          <v-text-field
            v-model="password1"
            type="password"
            prepend-icon="mdi-lock-outline"
            label="Password"
            :rules="[rules.passwordRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <!-- Password Retyped -->
          <v-text-field
            v-model="password2"
            type="password"
            prepend-icon="mdi-lock-outline"
            label="Re-type Password"
            :rules="[rules.passwordRule]"
            :error-messages="password_confirmation_Err"
            @change="() => (password_confirmation_Err = '')"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <!-- Website -->
          <v-text-field
            v-model="website"
            prepend-icon="mdi-web"
            label="Website"
            :rules="[rules.websiteRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <!-- Phone -->
          <v-text-field
            v-model="phone"
            prepend-icon="mdi-phone"
            label="Phone"
            :rules="[rules.phoneRule]"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Buttons -->
      <v-row>
        <v-col class="position-relative">
          <v-btn class="sign-btn" @click.prevent="signIn">Back</v-btn>
        </v-col>
        <v-col class="position-relative">
          <v-btn class="btn--dark" @click.prevent="saveDataAndPost"
            >Create new Account</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import rulesMixin from "../mixins/rules-mixin";
import firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "../mixins/firebase-config";

export default {
  name: "SignIn",
  mixins: [rulesMixin, firebaseConfig],
  data() {
    return {
      username: "",
      email: "",
      password1: "",
      password2: "",
      website: "",
      phone: "",
      password_confirmation_Err: "",
      error: null,
      database: null,
      twoLettersEmail: "",
    };
  },
  methods: {
    signIn() {
      this.$router.push("/sign-in");
    },
    async saveDataAndPost() {
      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        if (this.password1 !== this.password2) {
          this.password_confirmation_Err = "Passwords do not match";
        } else {
          this.twoLettersEmail = this.email.substring(0, 2);
          try {
            await this.$store.commit("setAvatarLabel", this.twoLettersEmail);
            await this.$store.dispatch("register", {
              email: this.email,
              password: this.password1,
            });

            this.writeUserData(
              this.$store.getters.userId,
              this.username,
              this.email,
              this.website,
              this.phone
            );

            this.$router.push("/to-do-directory");
          } catch (err) {
            this.error =
              err.message || "Failed to authenticate, try again later";
          }
        }
      }
    },
    writeUserData(userId, username, email, website, phone) {
      firebase
        .database()
        .ref("users/" + userId)
        .set({
          username: username,
          email: email,
          website: website,
          phone: phone,
        });
    },
  },
};
</script>
