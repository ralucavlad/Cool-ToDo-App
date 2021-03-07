<template>
  <section class="to-do-card" @click="$emit('clicked-on-card')">
    <v-row>
      <v-col>{{ toDoTitle }}</v-col>
      <v-col>{{ toDoStatus }}</v-col>
      <v-col>Due on {{ toDoDueDate }}</v-col>
    </v-row>
    <v-divider></v-divider>
  </section>
</template>

<script>
export default {
  props: ["toDoTitle", "toDoStatus", "toDoDueDate"],
};
</script>
