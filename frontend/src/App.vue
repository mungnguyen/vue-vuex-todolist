<template>
  <div id="app">
    <link rel="stylesheet" href="../node_modules/@fortawesome/fontawesome-free/css/all.css">
    <div class="header">
      <center>TO-DO LIST</center>
    </div>
    <div class="row">
      <div class="col-md-4 to-do-list">
        <div>
          <div
            v-for="(item, index) in list"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="item.id"
          >
            <ToDoList style="cursor: pointer" :todo="item" v-if="!item.tick"/>
          </div>
        </div>
        <div>
          <div
            v-for="(item, index) in list"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="item.id"
          >
            <ToDoList style="cursor: pointer" :todo="item" v-if="item.tick"/>
          </div>
        </div>
        <center>
          <b-button pill v-b-modal.modal variant="outline-primary">Add new</b-button>
        </center>
        <b-modal
          id="modal"
          ref="modal"
          :title="modalTitle"
          @show="resetModal"
          @hidden="reset"
          @ok="handleOk"
        >
          <form @submit.stop.prevent="handleSubmit">
            <b-form-group
              ref="titleForm"
              :state="titleState"
              label-cols-md="2"
              label="Tilte"
              label-for="title"
              invalid-feedback="Title is required"
            >
              <b-form-input id="title" v-model="title" :state="titleState" required></b-form-input>
            </b-form-group>

            <b-form-group
              ref="bodyForm"
              :state="bodyState"
              label-cols-md="2"
              label="Body"
              label-for="body"
              invalid-feedback="Body is required"
            >
              <b-form-input id="body" v-model="body" :state="bodyState" required></b-form-input>
            </b-form-group>

            <b-form-group
              ref="startDateForm"
              :state="startDateState"
              label-cols-md="2"
              label="Start: "
              label-for="startDate"
              invalid-feedback="Start date is invalid"
            >
              <b-form-input
                id="startDate"
                v-model="startDate"
                :value="startDate"
                :state="startDateState"
                required
                type="date"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              ref="endDateForm"
              :state="endDateState"
              label-cols-md="2"
              label="End: "
              label-for="endDate"
              invalid-feedback="End date is invalid"
            >
              <b-form-input
                id="endDate"
                v-model="endDate"
                :state="endDateState"
                required
                type="date"
              ></b-form-input>
            </b-form-group>
          </form>
        </b-modal>
        <div class="filter">
          <center>
            <b-button-group>
              <b-button @click="changeFilter('all')" variant="outline-primary">All</b-button>
              <b-button @click="changeFilter('completed')" variant="outline-secondary">Completed</b-button>
              <b-button @click="changeFilter('uncompleted')" variant="outline-success">Uncompleted</b-button>
            </b-button-group>
          </center>
        </div>
      </div>
      <div class="col-md-8" style="padding-left: 3em">
        <div v-if="todo">
          <p style="margin-top: 3em">
            <b>Title:</b>
            {{ this.todo.title}}
          </p>
          <br>
          <p>
            <b>Body:</b>
            {{ this.todo.body }}
          </p>
          <br>
          <p>
            <b>Start:</b>
            {{ this.todo.startDate | formatDate }}
          </p>
          <br>
          <p>
            <b>End:</b>
            {{ this.todo.endDate | formatDate }}
          </p>
          <br v-if="this.todo.tick">
          <p v-if="this.todo.tick">
            <b>Done:</b>
            {{ this.todo.doneDate | formatDate }}
          </p>
          <br>
          <b-button pill v-b-modal.modal variant="outline-primary" :pressed.sync="update">Update</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import ToDoList from "./components/ToDoList.vue";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "app",

  components: {
    ToDoList
  },

  data: function() {
    return {
      filter: "all",
      title: "",
      titleState: null,
      body: "",
      bodyState: null,
      startDate: "",
      startDateState: "",
      endDate: "",
      endDateState: null,
      update: false,
      todo: null,
      modalTitle: ""
    };
  },

  computed: {
    ...mapState({
      list(state) {
        if (this.filter === "all") return state.todoModule.list;
        if (this.filter === "completed")
          return state.todoModule.list.filter(item => item.tick);
        if (this.filter === "uncompleted")
          return state.todoModule.list.filter(item => !item.tick);
      }
    })
  },

  methods: {
    checkFormValidity() {
      const validTitle = this.title.length > 0 ? true : false;
      this.titleState = validTitle ? "valid" : "invalid";

      const validBody = this.body.length > 0 ? true : false;
      this.bodyState = validBody ? "valid" : "invalid";

      const now = moment().format("MM-DD-YYYY");

      const validStart = this.startDate ? true : false;
      this.startDateState = validStart ? "valid" : "invalid";

      const validDate =
        !this.endDate || this.endDate < now || this.endDate < this.startDate
          ? false
          : true;
      this.endDateState = validDate ? "valid" : "invalid";

      return validTitle && validBody && validDate && validStart;
    },

    resetModal() {
      if (!this.update) {
        this.modalTitle = "Add new to-do";
        this.title = "";
        this.titleState = null;
        this.body = "";
        this.bodyState = null;
        (this.startDate = ""),
          (this.startDateState = null),
          (this.endDate = ""),
          (this.endDateState = null);
      } else {
        this.modalTitle = "Update to-do";
        this.title = this.todo.title;
        this.titleState = null;
        this.body = this.todo.body;
        this.bodyState = null;
        (this.startDate = moment(this.todo.startDate)),
          (this.startDateState = null);
        this.endDate = moment(this.todo.endDate);
        this.endDateState = null;
      }
    },

    reset() {
      this.resetModal();
      this.update = false;
    },

    setTodo(todo) {
      this.todo = todo;
    },

    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
      this.update = false;
    },

    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      const todoChange = {
        title: this.title,
        body: this.body,
        startDate: moment(this.startDate).format("YYYY/MM/DD"),
        endDate: moment(this.endDate).format("YYYY/MM/DD")
      };
      if (this.update) {
        this.$store.commit("setId", this.todo.id);
        this.$store.commit("setTodo", todoChange);
        this.$store.dispatch("updateTodo");
        this.setTodo(todoChange);
      } else {
        this.$store.commit("setTodo", todoChange);
        this.$store.dispatch("addTodo");
      }

      // this.$refs.modal.hide();
      // Hide the modal manually
      this.$nextTick(() => {
        this.$refs.modal.hide();
      });
    },

    deleteTodo(id) {
      this.$store.commit("setId", id);
      this.$store.dispatch("deleteTodo");
    },

    changeFilter(filte) {
      this.filter = filte;
    }
  },

  mounted() {
    this.$store.dispatch("getAllTodo");
  }
};
</script>

<style>
.header {
  padding: 0.5em;
  font-size: 2em;
  color: rgb(89, 125, 201);
  background-color: rgb(233, 240, 247);
  box-shadow: 1em;
}

.to-do-list {
  border-right: 0.05em solid rgb(134, 131, 131);
  margin: 0;
  padding-top: 0.5em;
  padding-right: 0;
  height: 33.8em;
}

.todo span {
  margin-left: 3em;
  font: 1em sans-serif;
}

.delete {
  position: absolute;
  right: 1em;
  color: grey;
}

.delete:hover {
  color: black;
}

.filter {
  position: absolute;
  bottom: 1em;
  left: 5em;
}
</style>
