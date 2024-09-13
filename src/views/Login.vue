<template>
  <main class="app">
    <div class="login-form">
      <h1>Login</h1>
      <br>
      <input v-model="sid" type="text" name="id" id="id" placeholder="Student ID" />
      <input v-model="password" type="password" name="password" id="password" placeholder="Password" />
      <br>
      <button v-on:click="test()">Login</button>
    </div>
  </main>
</template>

<script lang="ts">

import axios from 'axios';

export default {
  data() {
    return {
      sid: '',
      password: ''
    }
  },
  methods: {
    test() {
      axios.post('http://localhost:8000/login', {
        sid: this.sid,
        password: this.password
      })
    }
  }
}

</script>