<template>
  <div class="calendar-week-view">
    <div class="calendar-row week-header">
      <div class="calendar-header-cell"></div>
      <div v-for="cell in weekCells" :key="cell.date" class="calendar-day-name">
        <div>{{ cell.dayName }}</div>
        <div>{{ cell.dateLabel }}</div>
      </div>
    </div>
    <div class="calendar-row">
      <div class="calendar-header-cell">All day</div>
      <div v-for="cell in weekCells" :key="cell.date + '-allday'" class="calendar-cell all-day">
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
    <div v-for="hour in 24" :key="hour" class="calendar-row">
      <div class="calendar-header-cell">{{ (hour-1).toString().padStart(2, '0') }}:00</div>
      <div v-for="cell in weekCells" :key="cell.date + '-' + hour" class="calendar-cell hour-cell event-cell-relative">
        <div class="cell-events">
          <div
            v-for="event in cell.events.filter(e => e.time && e.time.startsWith((hour-1).toString().padStart(2, '0')) )"
            :key="event.id"
            class="event-block"
            :style="eventBlockDynamicStyle(event)"
            @click.stop="onEventClick(event)"
          >
            <span class="event-time">{{ event.time }}</span>
            <span class="event-name">{{ event.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sortedEvents } from '../utils/sortEvents';
export default {
  name: 'WeekGrid',
  props: {
    weekCells: Array,
    onEventClick: Function
  },
  methods: {
    sortedEvents,
    eventBlockDynamicStyle(event) {
      if (!event.time) return {};
      const minute = parseInt(event.time.split(':')[1], 10);
      const height = ((60 - minute) / 60) * 100;
      return {
        position: 'absolute',
        left: '0',
        right: '0',
        bottom: '0',
        height: `calc(${height}% )`,
        background: event.color,
        borderRadius: '4px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        fontSize: '0.9em',
        gap: '4px',
      };
    }
  }
};
</script>

<style scoped>
.calendar-week-view {
  display: flex;
  flex-direction: column;
}
.calendar-row {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  min-height: 32px;
  border-bottom: 1px solid #e5e7eb;
}
.calendar-header-cell {
  text-align: right;
  padding: 0.2em 0.5em 0.2em 0;
  color: #6b7280;
  font-size: 0.95em;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  font-weight: 500;
  min-width: 80px;
}
.calendar-day-name {
  text-align: center;
  font-weight: 600;
  color: #22292f;
  padding: 0.2em 0;
}
.hour-cell {
  background: #fff;
  min-height: 32px;
  border: 1px solid #e5e7eb;
  position: relative;
}
.calendar-cell {
  min-height: 32px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 2px;
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
  alignItems: center;
  gap: 4px;
}
.event-time {
  font-weight: bold;
}
.not-current {
  opacity: 0.4;
}
.event-cell-relative {
  position: relative;
}
</style> 