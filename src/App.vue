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
  },
  watch: {
    autoLoggedOut(currentValue, oldValue) {
      if (currentValue && currentValue != oldValue) {
        this.$router.replace("/home");
      }
    },
  },
  created() {
    this.$store.dispatch("autoLogin");
  },
};
</script>

<style lang="scss">
@import "sass/main.scss";
</style>
