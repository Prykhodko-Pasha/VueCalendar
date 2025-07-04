<template>
  <div class="calendar-body">
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
          v-for="event in sortedEvents(cell.events)"
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
  </div>
</template>

<script>
import { sortedEvents } from '../utils/sortEvents';
export default {
  name: 'MonthGrid',
  props: {
    calendarCells: Array,
    onDateClick: Function,
    onEventClick: Function
  },
  methods: {
    sortedEvents
  }
};
</script>

<style scoped>
.calendar-body {
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
</style> 