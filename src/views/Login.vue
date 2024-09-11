<template>
  <main class="app">
    <div class="login-form">
        <h1>Login</h1>
        <br>
        <input ref="sid" type="text" name="id" id="id" placeholder="Student ID" />
        <input ref="password" type="password" name="password" id="password" placeholder="Password" />
        <br>
        <button v-on:click="test()">Login</button>
    </div>
  </main>
</template>

<script lang="ts">

import axios from 'axios';

export default {
    methods: {
      test() {
        const sid = this.$refs.sid.value;
        const password = this.$refs.password.value;

        axios.post('http://localhost:8000/login', {
          sid: sid,
          password: password
        })
      }
    }
  }

</script>