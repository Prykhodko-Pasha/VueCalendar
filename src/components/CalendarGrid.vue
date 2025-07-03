<template>
  <div class="calendar-grid">
    <div class="calendar-header">
      <div v-for="day in headerDays" :key="day" class="calendar-cell header">{{ day }}</div>
    </div>
    <div class="calendar-body">
      <template v-if="viewMode === 'month'">
        <div
          v-for="cell in calendarCells"
          :key="cell.date"
          class="calendar-cell"
          :class="{ today: cell.isToday, 'not-current': !cell.isCurrentMonth }"
          @click="onDateClick(cell.date)"
        >
          <div class="cell-date">{{ cell.day }}</div>
          <div class="cell-events">
            <div
              v-for="event in cell.events"
              :key="event.id"
              class="event-block"
              :style="{ background: event.color }"
              @click.stop="onEventClick(event)"
            >
              <span class="event-time">{{ event.time }}</span>
              <span class="event-name">{{ event.name }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="viewMode === 'week'">
        <div
          v-for="cell in weekCells"
          :key="cell.date"
          class="calendar-cell"
          :class="{ today: cell.isToday }"
          @click="onDateClick(cell.date)"
        >
          <div class="cell-date">{{ cell.day }}</div>
          <div class="cell-events">
            <div
              v-for="event in cell.events"
              :key="event.id"
              class="event-block"
              :style="{ background: event.color }"
              @click.stop="onEventClick(event)"
            >
              <span class="event-time">{{ event.time }}</span>
              <span class="event-name">{{ event.name }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="calendar-cell today day-view" @click="onDateClick(currentDate)">
          <div class="cell-date">{{ dayViewCell.day }}</div>
          <div class="cell-events">
            <div
              v-for="event in dayViewCell.events"
              :key="event.id"
              class="event-block"
              :style="{ background: event.color }"
              @click.stop="onEventClick(event)"
            >
              <span class="event-time">{{ event.time }}</span>
              <span class="event-name">{{ event.name }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { useCalendarStore } from '../store';
import { computed } from 'vue';

export default {
  name: 'CalendarGrid',
  props: {
    viewMode: { type: String, default: 'month' },
    currentDate: { type: String, required: true }
  },
  emits: ['create-event', 'edit-event'],
  setup(props, { emit }) {
    const calendarStore = useCalendarStore();
    const today = new Date().toISOString().slice(0, 10);
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Month view logic
    const monthDate = computed(() => new Date(props.currentDate));
    const year = computed(() => monthDate.value.getFullYear());
    const month = computed(() => monthDate.value.getMonth());
    const firstDay = computed(() => new Date(year.value, month.value, 1));
    const lastDay = computed(() => new Date(year.value, month.value + 1, 0));
    const startDayOfWeek = computed(() => firstDay.value.getDay() || 7);

    const calendarCells = computed(() => {
      const cells = [];
      let dayOffset = 1 - (startDayOfWeek.value === 7 ? 0 : startDayOfWeek.value);
      for (let i = 0; i < 42; i++) {
        const cellDate = new Date(year.value, month.value, dayOffset + i + 1);
        const dateStr = cellDate.toISOString().slice(0, 10);
        const isCurrentMonth = cellDate.getMonth() === month.value;
        cells.push({
          date: dateStr,
          day: cellDate.getDate(),
          isToday: dateStr === today,
          isCurrentMonth,
          events: calendarStore.events.filter(e => e.date === dateStr)
        });
      }
      return cells;
    });

    // Week view logic
    const weekCells = computed(() => {
      const date = new Date(props.currentDate);
      const dayOfWeek = date.getDay() || 7;
      const start = new Date(date);
      start.setDate(date.getDate() - dayOfWeek + 1);
      return Array.from({ length: 7 }, (_, i) => {
        const cellDate = new Date(start);
        cellDate.setDate(start.getDate() + i);
        const dateStr = cellDate.toISOString().slice(0, 10);
        return {
          date: dateStr,
          day: cellDate.getDate(),
          isToday: dateStr === today,
          events: calendarStore.events.filter(e => e.date === dateStr)
        };
      });
    });

    // Day view logic
    const dayViewCell = computed(() => {
      const date = new Date(props.currentDate);
      const dateStr = date.toISOString().slice(0, 10);
      return {
        date: dateStr,
        day: date.getDate(),
        isToday: dateStr === today,
        events: calendarStore.events.filter(e => e.date === dateStr)
      };
    });

    const headerDays = computed(() => weekDays);

    function onDateClick(date) {
      emit('create-event', date);
    }
    function onEventClick(event) {
      emit('edit-event', event);
    }

    return {
      weekDays,
      headerDays,
      calendarCells,
      weekCells,
      dayViewCell,
      onDateClick,
      onEventClick,
      today,
      currentDate: props.currentDate,
      viewMode: props.viewMode
    };
  }
};
</script>

<style scoped>
.calendar-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.calendar-header, .calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.calendar-cell {
  min-height: 80px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 4px;
  position: relative;
  cursor: pointer;
}
.calendar-cell.header {
  background: #fff;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid #3B82F6;
  cursor: default;
}
.cell-date {
  font-size: 1.1em;
  font-weight: bold;
  color: #22292f;
}
.today {
  border: 2px solid #3B82F6;
}
.cell-events {
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.event-block {
  background: #3B82F6;
  color: #fff;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 0.9em;
  margin-bottom: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.event-time {
  font-weight: bold;
}
.not-current {
  opacity: 0.4;
}
.day-view {
  grid-column: span 7;
  min-height: 200px;
}
</style> 