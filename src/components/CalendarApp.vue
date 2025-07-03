<template>
  <div class="calendar-app">
    <header>
      <h1>Vue.js Event Calendar</h1>
      <!-- View mode switcher, navigation, etc. -->
    </header>
    <main>
      <!-- Calendar grid and events -->
      <CalendarGrid />
    </main>
    <!-- Event modal, forms, etc. -->
    <EventModal />
  </div>
</template>

<script>
import CalendarGrid from './CalendarGrid.vue';
import EventModal from './EventModal.vue';

export default {
  name: 'CalendarApp',
  components: {
    CalendarGrid,
    EventModal
  }
};
</script>

<style scoped>
.calendar-app {
  min-width: 1024px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}
</style> 