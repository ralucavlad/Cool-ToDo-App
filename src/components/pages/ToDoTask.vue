<template>
  <v-container class="to-do-task">
    <router-link to="/to-do-directory">Back to my Todo list</router-link>
    <v-form class="to-do-task__form" ref="form">
      <h3 v-if="taskId === false">Add a new Todo</h3>
      <h3 v-else>Edit Todo</h3>

      <!-- Title -->
      <v-text-field
        v-model="title"
        label="Todo title"
        :rules="[rules.stringRule]"
      ></v-text-field>

      <!-- Task due date -->
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            :rules="[rules.dateRule]"
            label="Due date"
            readonly
            v-on="on"
            ref="dateInput"
          ></v-text-field>
        </template>
        <v-date-picker
          ref="picker"
          v-model="date"
          :min="new Date().toISOString().substr(0, 10)"
          @change="saveDate"
        ></v-date-picker>
      </v-menu>

      <!-- Status -->
      <v-select
        :items="statusItems"
        label="Status"
        solo
        v-model="select"
        :rules="[rules.statusRule]"
      ></v-select>

      <v-btn v-if="taskId === false" @click="postTask('add')">Add Todo</v-btn>
      <v-btn v-if="taskId === true" @click="postTask('edit')">Edit Todo</v-btn>
      <v-btn v-if="taskId === true" @click="postTask('remove')"
        >Delete Todo</v-btn
      >
    </v-form>
  </v-container>
</template>

<script>
import rulesMixin from "../mixins/rules-mixin";
import firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "../mixins/firebase-config";

export default {
  name: "ToDoTask",
  mixins: [rulesMixin, firebaseConfig],
  data() {
    return {
      title: "",
      menu: "",
      date: "",
      select: "",
      error: null,
      database: null,
      statusItems: ["Complete", "Pending"],
      uniqueToDoId: null,
      taskId: false,
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },

  methods: {
    saveDate(date) {
      this.$refs.menu.save(date);
    },
    async postTask(action) {
      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        try {
          if (action === "edit" || action === "remove") {
            this.uniqueToDoId = this.$store.getters.taskOpened.todoId;
          } else {
            this.uniqueToDoId = "id" + new Date().getTime();
          }

          if (action === "remove") {
            await firebase
              .database()
              .ref("users/" + this.$store.getters.userId)
              .child("todos")
              .child(this.uniqueToDoId)
              .remove();
          } else {
            await firebase
              .database()
              .ref("users/" + this.$store.getters.userId)
              .child("todos")
              .child(this.uniqueToDoId)
              .set({
                title: this.title,
                date: this.date,
                status: this.select,
              });
          }

          this.$router.push("/to-do-directory");
        } catch (err) {
          this.error = err.message || "Failed to add task, try again later";
        }
      }
    },
  },
  created() {
    if (this.$route.params.taskId) {
      this.taskId = true;
    } else {
      this.taskId = false;
    }
    if (this.taskId === true) {
      const taskOpened = this.$store.getters.taskOpened;
      this.title = taskOpened.toDoTitle;
      this.date = taskOpened.toDoDueDate;
      this.select = taskOpened.toDoStatus;
    }
  },
};
</script>
