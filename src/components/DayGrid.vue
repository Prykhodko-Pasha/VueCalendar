<template>
  <div class="calendar-day-view">
    <div class="calendar-row day-header">
      <div class="calendar-hour-label"></div>
      <div class="calendar-day-name">
        <div>{{ dayViewCell.dayName }}</div>
        <div>{{ dayViewCell.dateLabel }}</div>
      </div>
    </div>
    <div v-for="hour in 24" :key="hour" class="calendar-row">
      <div class="calendar-hour-label">{{ (hour-1).toString().padStart(2, '0') }}:00</div>
      <div class="calendar-cell hour-cell">
        <div class="cell-events">
          <div
            v-for="event in dayViewCell.events.filter(e => e.time && e.time.startsWith((hour-1).toString().padStart(2, '0')) )"
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
  </div>
</template>

<script>
export default {
  name: 'DayGrid',
  props: {
    dayViewCell: Object,
    onEventClick: Function
  }
};
</script>

<style scoped>
.calendar-day-view {
  display: flex;
  flex-direction: column;
}
.calendar-row {
  display: grid;
  grid-template-columns: 60px 1fr;
  min-height: 32px;
  border-bottom: 1px solid #e5e7eb;
}
.calendar-hour-label {
  text-align: right;
  padding: 0.2em 0.5em 0.2em 0;
  color: #6b7280;
  font-size: 0.95em;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  font-weight: 500;
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