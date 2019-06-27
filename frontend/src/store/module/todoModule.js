import axios from 'axios'

//init state
const state = {
    list: [],
    todo: "",
    id: ""
}

//getter
const getters = {}

const mutations = {
    getAllTodo (state, list) {
        state.list = list
    },

    setTodo (state, todo) {
        state.todo = todo
    },

    addTodo (state, todo) {
        state.list.push(todo)
    },

    setId (state, id) {
        state.id = id
    }
}

const actions = {
    getAllTodo ({ commit }) {
        axios.get('/api/getAllTodo').then (res => {
            commit('getAllTodo', res.data)
        })
    },

    addTodo ({ commit }, ) {
        if (!state.todo) { 
            return
        }

        axios.post('/api/addTodo', state.todo).then(res => {
            commit('addTodo', res.data)
        })
    },

    updateTodo ({ dispatch }) {
        if (!state.todo) {
            return
        }

        axios.put('/api/updateTodo/' + state.id, state.todo).then(
            dispatch('getAllTodo')
        )
    },

    deleteTodo ({ dispatch }) {
        if (!state.id) {
            return
        }

        axios.delete('/api/deleteTodo/' + state.id).then(
            dispatch('getAllTodo')
        )
    }
}

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
}