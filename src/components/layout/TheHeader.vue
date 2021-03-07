<template>
  <v-container fluid class="global-header">
    <v-row align="center">
      <v-col class="global-header__col">
        <img src="../../img/oracle_logo.png" alt="Logo" @click="goToHome" />
      </v-col>

      <v-col class="global-header__col right-align" align="center">
        <div class="global-header__col--right">
          <v-avatar v-if="isLoggedIn" color="secondary" size="36">
            <span class="white--text headline">{{ avatarLabel }}</span>
          </v-avatar>
          <router-link to="/sign-in" v-if="!isLoggedIn">Sign in</router-link>
          <a v-if="isLoggedIn" @click="logout">Logout</a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TheHeader",
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    avatarLabel() {
      return this.$store.getters.avatarLabel;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/home");
    },
    goToHome() {
      this.$router.push("/home");
    },
  },
};
</script>
