<script setup lang="ts">
import user from "@/main.ts"
console.log(user)
</script>

<template>
  <main class="app">
    <h1>Welcome Back,</h1>
    <h2>{{user.name}}</h2>
  </main>
</template>
