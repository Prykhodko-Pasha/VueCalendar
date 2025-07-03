import { defineStore } from 'pinia';

const EVENTS_KEY = 'calendar-events';
const VIEW_MODE_KEY = 'calendar-view-mode';
const CURRENT_DATE_KEY = 'calendar-current-date';

function loadFromLocalStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    events: loadFromLocalStorage(EVENTS_KEY, []),
    viewMode: loadFromLocalStorage(VIEW_MODE_KEY, 'month'),
    currentDate: loadFromLocalStorage(CURRENT_DATE_KEY, new Date().toISOString().slice(0, 10)),
  }),
  actions: {
    addEvent(event) {
      this.events.push(event);
      saveToLocalStorage(EVENTS_KEY, this.events);
    },
    updateEvent(updatedEvent) {
      const idx = this.events.findIndex(e => e.id === updatedEvent.id);
      if (idx !== -1) {
        this.events[idx] = updatedEvent;
        saveToLocalStorage(EVENTS_KEY, this.events);
      }
    },
    deleteEvent(eventId) {
      this.events = this.events.filter(e => e.id !== eventId);
      saveToLocalStorage(EVENTS_KEY, this.events);
    },
    setViewMode(mode) {
      this.viewMode = mode;
      saveToLocalStorage(VIEW_MODE_KEY, mode);
    },
    setCurrentDate(date) {
      this.currentDate = date;
      saveToLocalStorage(CURRENT_DATE_KEY, date);
    },
    loadEvents() {
      this.events = loadFromLocalStorage(EVENTS_KEY, []);
    }
  }
}); 