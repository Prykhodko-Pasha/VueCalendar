<template>
  <div class="calendar-grid">
    <div class="calendar-period-label">{{ periodLabel }}</div>
    <div v-if="viewMode === 'month'">
      <MonthGrid
        :key="'month-' + currentDate"
        :calendarCells="calendarCells"
        :onDateClick="onDateClick"
        :onEventClick="onEventClick"
      />
    </div>
    <div v-else-if="viewMode === 'week'">
      <WeekGrid
        :key="'week-' + currentDate"
        :weekCells="weekCellsWithNames"
        :onEventClick="onEventClick"
      />
    </div>
    <div v-else>
      <DayGrid
        :key="'day-' + currentDate"
        :dayViewCell="dayViewCellWithNames"
        :onEventClick="onEventClick"
      />
    </div>
  </div>
</template>

<script>
import MonthGrid from './MonthGrid.vue';
import WeekGrid from './WeekGrid.vue';
import DayGrid from './DayGrid.vue';
import { useCalendarStore } from '../store';
import { computed } from 'vue';

function formatLocalDate(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

function getTodayLocal() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return formatLocalDate(now);
}

export default {
  name: 'CalendarGrid',
  components: { MonthGrid, WeekGrid, DayGrid },
  props: {
    viewMode: { type: String, default: 'month' },
    currentDate: { type: String, required: true }
  },
  emits: ['create-event', 'edit-event'],
  setup(props, { emit }) {
    const calendarStore = useCalendarStore();
    const today = getTodayLocal();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    console.log(props.viewMode);
    // Month view logic
    const monthDate = computed(() => new Date(props.currentDate));
    const year = computed(() => monthDate.value.getFullYear());
    const month = computed(() => monthDate.value.getMonth());
    const firstDay = computed(() => new Date(year.value, month.value, 1));
    const lastDay = computed(() => new Date(year.value, month.value + 1, 0));
    const startDayOfWeek = computed(() => firstDay.value.getDay() || 7);

    const calendarCells = computed(() => {
      const cells = [];
      // Get the weekday index for the first day of the month (Monday=0, ..., Sunday=6)
      let firstDayWeekIndex = firstDay.value.getDay(); // 0 (Sun) - 6 (Sat)
      let offset = -((firstDayWeekIndex + 6) % 7);
      for (let i = 0; i < 42; i++) {
        const cellDate = new Date(year.value, month.value, offset + i + 1);
        const dateStr = formatLocalDate(cellDate);
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
        const dateStr = formatLocalDate(cellDate);
        const dayName = weekDays[cellDate.getDay() === 0 ? 6 : cellDate.getDay() - 1];
        const dateLabel = cellDate.toLocaleDateString();
        return {
          date: dateStr,
          day: cellDate.getDate(),
          dayName,
          dateLabel,
          isToday: dateStr === today,
          events: calendarStore.events.filter(e => e.date === dateStr)
        };
      });
    });

    // Day view logic
    const dayViewCell = computed(() => {
      const date = new Date(props.currentDate);
      const dateStr = formatLocalDate(date);
      return {
        date: dateStr,
        day: date.getDate(),
        isToday: dateStr === today,
        events: calendarStore.events.filter(e => e.date === dateStr)
      };
    });

    // Add day name and date label for week view
    const weekCellsWithNames = computed(() => {
      return weekCells.value.map(cell => ({
        ...cell,
        dayName: weekDays[new Date(cell.date).getDay() === 0 ? 6 : new Date(cell.date).getDay() - 1],
        dateLabel: new Date(cell.date).toLocaleDateString()
      }));
    });
    console.log(weekCellsWithNames.value);
    // Add day name and date label for day view
    const dayViewCellWithNames = computed(() => {
      const cell = dayViewCell.value;
      const d = new Date(cell.date);
      return {
        ...cell,
        dayName: weekDays[d.getDay() === 0 ? 6 : d.getDay() - 1],
        dateLabel: d.toLocaleDateString()
      };
    });

    const periodLabel = computed(() => {
      const date = new Date(props.currentDate);
      if (props.viewMode === 'month') {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
      } else if (props.viewMode === 'week') {
        const start = new Date(date);
        start.setDate(date.getDate() - (date.getDay() || 7) + 1);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
      } else {
        return date.toLocaleDateString();
      }
    });

    function onDateClick(date) {
      emit('create-event', date);
    }
    function onEventClick(event) {
      emit('edit-event', event);
    }

    return {
      periodLabel,
      calendarCells,
      weekCellsWithNames,
      dayViewCellWithNames,
      onDateClick,
      onEventClick,
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
.calendar-period-label {
  font-size: 1.3em;
  font-weight: 700;
  color: #22292f;
  margin-bottom: 0.5em;
  text-align: center;
  letter-spacing: 0.01em;
}
</style> 