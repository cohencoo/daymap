<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <aside>
    <RouterLink to="/"><div>Dashboard</div></RouterLink>
    <RouterLink to="/assignments"><div>Assignments</div></RouterLink>
    <RouterLink to="/tasks"><div>Tasks</div></RouterLink>
  </aside>
  <div class="shifted">
    <RouterView />
  </div>
</template>