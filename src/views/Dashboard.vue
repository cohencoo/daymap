<script lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import user from "@/main"

export default {
  components: {
    FullCalendar,
    dayGridPlugin,
    interactionPlugin,
  },
  data() {
    return {
      user: user,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'timeGridWeek',
        weekends: false,
        firstDay: 1,
        slotMinTime: '08:00:00',
        slotMaxTime: '18:00:00',
        nowIndicator: true,
        events: user.timetable,
      }
    }
  }
}

</script>

<template>
  <main class="app">
    <h1>Welcome Back,</h1>
    <h2>{{user.name}}</h2>

    <div style="width: 800px">
      <FullCalendar :options="calendarOptions" />
    </div>
  </main>
</template>


