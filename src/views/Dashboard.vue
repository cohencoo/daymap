<template>
  <nav>
    <div>
      <h2>Welcome Back,</h2>
      <span>{{ user.name }}</span>
    </div>
  </nav>
  <main class="app">
    <div class="notice">
      <div class="flex">
        <div class="dot"></div>
        <div class="info">
          <h2>
            {{ nextLesson.title }} at 
            {{ new Date(nextLesson.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }}</h2>
          <span>{{ timeUntilNextLesson }}</span>
        </div>
      </div>
      <p>Teacher Note: Please remember to bring your books.</p>
    </div>

    <div style="width: 1070px">
      <FullCalendar :options="calendarOptions" />
    </div>
  </main>
</template>

<script lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import type { User } from './store';

export default defineComponent({
  components: {
    FullCalendar,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.getters.user as User);

    const calendarOptions = computed(() => ({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev,next,today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      initialView: 'timeGridWeek',
      weekends: false,
      firstDay: 1,
      slotMinTime: '08:00:00',
      slotMaxTime: '18:00:00',
      nowIndicator: true,
      events: user.value.timetable || [],
    }));

    const nextLesson = computed(() => {
      const now = new Date();
      const upcomingLessons = user.value.timetable
        .map((event: { start: string }) => ({
          ...event,
          start: new Date(event.start),
        }))
        .filter((event: { start: Date }) => event.start.getTime() > now.getTime())
        .sort((a: any, b: any) => a.start.getTime() - b.start.getTime());
      
      return upcomingLessons.length > 0 ? upcomingLessons[0] : { title: 'No more lessons today', start: '' };
    });

    const timeUntilNextLesson = computed(() => {
      const now = new Date();
      const nextStart = new Date(nextLesson.value.start);
      const diff = nextStart.getTime() - now.getTime();

      if (diff < 0) return ''; // No upcoming lesson

      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
      const days = Math.floor(diff / 1000 / 60 / 60 / 24);

      const timeParts = [];
      if (days > 0) timeParts.push(`${days} day${days > 1 ? 's' : ''}`);
      if (hours > 0) timeParts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
      if (minutes > 0) timeParts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);

      return `In ${timeParts.join(', ')}`;
    });

    return {
      user,
      calendarOptions,
      nextLesson,
      timeUntilNextLesson,
    };
  },
});
</script>
