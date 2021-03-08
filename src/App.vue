<template>
  <v-app>
    <v-main>
      <the-header></the-header>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import TheHeader from "./components/layout/TheHeader.vue";

export default {
  name: "App",
  components: {
    TheHeader,
  },
  computed: {
    autoLoggedOut() {
      return this.$store.getters.autoLoggedOut;
    },
    getGoogleLoginStatus() {
      return this.$store.getters.getGoogleLogin;
    },
  },
  watch: {
    autoLoggedOut(currentValue, oldValue) {
      if (currentValue && currentValue != oldValue) {
        this.$router.replace("/home");
      }
    },
    getGoogleLoginStatus(currentValue, oldValue) {
      if (currentValue && currentValue != oldValue) {
        this.$router.replace("/to-do-directory");
      }
    },
  },
  created() {
    this.$store.dispatch("autoLogin");
  },
  mounted() {
    if (this.$store.getters.getGoogleLogin) {
      this.$store.dispatch("loginGoogle");
    }
  },
};
</script>

<style lang="scss">
@import "sass/main.scss";
</style>
