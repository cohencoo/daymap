<template>
  <nav>
    <div>
      <h2>{{ user.name }}'s Assignments</h2>
    </div>
  </nav>
  <main class="app">    
    <div v-for="task in user.tasks" :key="task.id">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description }}</p>
      <p>Due Date: {{ task.dueDate }}</p>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import type { User } from './store';

export default defineComponent({
  setup() {
    const store = useStore();
    const user = computed(() => store.getters.user as User) as User;

    return {
      user,
    };
  },
});
</script>
