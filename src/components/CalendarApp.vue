<template>
  <div class="calendar-app">
    <header>
      <h1>Vue.js Event Calendar</h1>
      <div class="calendar-controls">
        <div class="nav-btn-group">
          <button class="nav-btn" @click="goToPrev">&#8592;</button>
          <button class="nav-btn" @click="goToNext">&#8594;</button>
        </div>
        <span class="period-label">{{ formattedPeriod }}</span>
        <div class="view-mode-group">
          <button
            v-for="mode in ['month', 'week', 'day']"
            :key="mode"
            :class="['view-mode-btn', { active: calendarStore.viewMode === mode }]"
            @click="setViewMode(mode)"
            type="button"
          >
            {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
          </button>
        </div>
      </div>
    </header>
    <main>
      <CalendarGrid
        :viewMode="calendarStore.viewMode"
        :currentDate="calendarStore.currentDate"
        @create-event="openCreateModal"
        @edit-event="openEditModal"
      />
    </main>
    <EventModal
      :visible="modalVisible"
      :event="selectedEvent"
      @close="closeModal"
      @save="handleSaveEvent"
    />
  </div>
</template>

<script>
import CalendarGrid from './CalendarGrid.vue';
import EventModal from './EventModal.vue';
import { useCalendarStore } from '../store';

function formatPeriod(viewMode, currentDate) {
  const date = new Date(currentDate);
  if (viewMode === 'month') {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  } else if (viewMode === 'week') {
    const start = new Date(date);
    start.setDate(date.getDate() - (date.getDay() || 7) + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  } else {
    return date.toLocaleDateString();
  }
}

export default {
  name: 'CalendarApp',
  components: {
    CalendarGrid,
    EventModal
  },
  data() {
    return {
      modalVisible: false,
      selectedEvent: null
    };
  },
  setup() {
    const calendarStore = useCalendarStore();
    return { calendarStore };
  },
  computed: {
    formattedPeriod() {
      return formatPeriod(this.calendarStore.viewMode, this.calendarStore.currentDate);
    }
  },
  methods: {
    openCreateModal(date) {
      this.selectedEvent = {
        name: '',
        date: date || '',
        time: '',
        notes: '',
        color: '#3B82F6'
      };
      this.modalVisible = true;
    },
    openEditModal(event) {
      this.selectedEvent = { ...event };
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
      this.selectedEvent = null;
    },
    handleSaveEvent(eventData) {
      if (eventData.id) {
        eventData.updatedAt = new Date();
        this.calendarStore.updateEvent(eventData);
      } else {
        eventData.id = Math.random().toString(36).substr(2, 9);
        eventData.createdAt = new Date();
        eventData.updatedAt = new Date();
        this.calendarStore.addEvent(eventData);
      }
    },
    setViewMode(mode) {
      console.log(mode);
      this.calendarStore.setViewMode(mode);
    },
    goToPrev() {
      const date = new Date(this.calendarStore.currentDate);
      if (this.calendarStore.viewMode === 'month') {
        date.setMonth(date.getMonth() - 1);
      } else if (this.calendarStore.viewMode === 'week') {
        date.setDate(date.getDate() - 7);
      } else {
        date.setDate(date.getDate() - 1);
      }
      this.calendarStore.setCurrentDate(date.toISOString().slice(0, 10));
    },
    goToNext() {
      const date = new Date(this.calendarStore.currentDate);
      if (this.calendarStore.viewMode === 'month') {
        date.setMonth(date.getMonth() + 1);
      } else if (this.calendarStore.viewMode === 'week') {
        date.setDate(date.getDate() + 7);
      } else {
        date.setDate(date.getDate() + 1);
      }
      this.calendarStore.setCurrentDate(date.toISOString().slice(0, 10));
    }
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
h1 {
  color: #22292f;
}
.calendar-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.nav-btn-group {
  display: flex;
  gap: 0.2rem;
}
.period-label {
  font-weight: bold;
  font-size: 1.1em;
  margin: 0 1rem;
}
.view-mode-group {
  display: flex;
  gap: 0.5rem;
}
.view-mode-btn {
  background: #fff;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 0.3rem 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.view-mode-btn.active {
  color: #3B82F6;
  border-color: #3B82F6;
}
.nav-btn {
  background: #fff;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  font-size: 1.1em;
  cursor: pointer;
  transition: border-color 0.2s;
}
.nav-btn:hover {
  border-color: #3B82F6;
}
</style> 