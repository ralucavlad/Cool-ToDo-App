<template>
  <v-container class="to-do-directory">
    <v-toolbar flat>
      <v-toolbar-title>
        <v-btn class="header-todo" @click="addTask">
          <i class="header-todo__icon icon-basic-notebook-pen"></i>
          <span>
            <h3>Add a new Todo</h3>
          </span>
        </v-btn>
      </v-toolbar-title>

      <template v-slot:extension>
        <v-tabs v-model="tab" align-with-title id="header__tabs">
          <v-tabs-slider color="black"></v-tabs-slider>

          <v-tab v-for="item in tabItems" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in tabItems" :key="item">
        <v-card flat>
          <!-- <v-card-text v-text="item"></v-card-text> -->
          <to-do-card
            v-for="(task, index) in filteredTasks"
            :key="index"
            :toDoTitle="task.toDoTitle"
            :toDoStatus="task.toDoStatus"
            :toDoDueDate="task.toDoDueDate"
            @clicked-on-card="goEditTask(task.todoId)"
          ></to-do-card>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import ToDoCard from "../layout/ToDoCard.vue";
import firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "../mixins/firebase-config";

export default {
  name: "ToDoDirectory",
  mixins: [firebaseConfig],
  components: {
    ToDoCard,
  },
  data() {
    return {
      tab: "",
      tabItems: ["Todos", "Pending", "Complete"],
      toDoTasks: [],
      taskSeenId: null,
    };
  },
  computed: {
    filteredTasks() {
      return this.toDoTasks.filter((task) => {
        if (this.tab === 0) {
          return true;
        }
        if (this.tab === 1 && task.toDoStatus === "Pending") {
          return true;
        }
        if (this.tab === 2 && task.toDoStatus === "Complete") {
          return true;
        }
        return false;
      });
    },
  },
  methods: {
    async getUserData() {
      return firebase
        .database()
        .ref("/users/" + this.$store.getters.userId)
        .once("value")
        .then((snapshot) => {
          if (snapshot.val()) {
            const todoObj = snapshot.val().todos;
            for (const property in todoObj) {
              this.toDoTasks.push({
                toDoTitle: todoObj[property].title,
                toDoStatus: todoObj[property].status,
                toDoDueDate: todoObj[property].date,
                todoId: property,
              });
            }
          }
        });
    },
    addTask() {
      this.$router.push("/to-do-task");
    },
    goEditTask(taskId) {
      for (let i = 0; i < this.toDoTasks.length; i++) {
        if (this.toDoTasks[i].todoId === taskId) {
          this.taskSeenId = taskId;
          this.$store.commit("setTaskOpened", {
            toDoTitle: this.toDoTasks[i].toDoTitle,
            toDoStatus: this.toDoTasks[i].toDoStatus,
            toDoDueDate: this.toDoTasks[i].toDoDueDate,
            todoId: this.toDoTasks[i].todoId,
          });
        }
      }
      this.$router.push("/to-do-task/" + this.taskSeenId);
    },
  },
  created() {
    this.getUserData();
  },
};
</script>
