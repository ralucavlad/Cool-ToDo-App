<template>
  <v-container class="main-page">
    <section class="title">
      <div class="title--centering">
        <h1>Cool ToDo App</h1>
      </div>
    </section>
    <section class="about">
      <v-row>
        <v-col @click="goToTaskDirectory">
          <i class="about__icon icon-basic-calendar"></i>
          <p class="about__paragraph">Add tasks to calendar</p>
        </v-col>
        <v-col @click="goToTaskDirectory">
          <i class="about__icon icon-basic-todolist-pencil"></i>
          <p class="about__paragraph">Edit tasks</p>
        </v-col>
        <v-col @click="goToTaskDirectory">
          <i class="about__icon icon-basic-trashcan"></i>
          <p class="about__paragraph">Delete tasks</p>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script>
export default {
  name: "HomePage",
  methods: {
    goToTaskDirectory() {
      this.$router.push("/to-do-directory");
    },
  },
};
</script>
