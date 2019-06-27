
<template>
  <div class="todo">
    <span v-if="!todo.tick">
      <i @click="changeTick" class="far fa-circle"></i>
      <span @click="setTodo">{{ todo.title }}</span>
    </span>
    <span v-if="todo.tick" style="color: grey">
      <i @click="changeTick" class="fas fa-check-circle"></i>
      <span @click="setTodo">
        <strike>{{ todo.title }}</strike>
      </span>
    </span>
    <i @click="deleteTodo" class="fas fa-trash-alt delete"></i>
    <hr>
  </div>
</template>


<script>
import moment from "moment";
export default {
  name: "ToDoList",
  props: {
    todo: Object
  },
  computed: {
    
  },

  methods: {
    setTodo() {
      this.$parent.setTodo(this.todo);
    },
    deleteTodo() {
      this.$parent.deleteTodo(this.todo.id);
    },
    changeTick() {
      const todoChange = this.todo.tick
        ? {
            tick: !this.todo.tick,
            doneDate: null
          }
        : {
            tick: !this.todo.tick,
            doneDate: moment().format("YYYY/MM/DD")
          };
      this.$store.commit("setTodo", todoChange);
      this.$store.commit("setId", this.todo.id);
      this.$store.dispatch("updateTodo");
    }
  }
};
</script>

<style>
</style>
