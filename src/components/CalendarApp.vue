<template>
  <div class="calendar-app">
    <div class="calendar-toolbar">
      <div class="toolbar-left">
        <span class="calendar-title">Calendar View</span>
        <div class="nav-buttons-group">
          <button class="nav-btn today" @click="goToToday">Today</button>
          <button class="nav-btn" @click="goToPrev">Back</button>
          <button class="nav-btn" @click="goToNext">Next</button>
        </div>
      </div>
      <div class="toolbar-center">
        <span class="month-title">{{ currentTitle }}</span>
      </div>
      <div class="toolbar-right">
        <div class="view-switcher-group">
          <button
            v-for="view in availableViews"
            :key="view.value"
            :class="['view-btn', { active: currentView === view.value }]"
            @click="changeView(view.value)"
          >
            {{ view.label }}
          </button>
        </div>
      </div>
    </div>

    <FullCalendar
      ref="calendarRef"
      :options="calendarOptions"
      class="calendar-container"
    />

    <!-- Event Modal -->
    <div class="modal-container" v-if="showEventModal" @click="closeEventModal">
      <EventModal
        :event="selectedEvent"
        :is-edit="isEditMode"
        :position="modalPosition"
        @close="closeEventModal"
        @save="saveEvent"
        @delete="deleteEvent"
      />
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import EventModal from './EventModal.vue'

export default {
  name: 'CalendarApp',
  components: {
    FullCalendar,
    EventModal
  },
  setup() {
    const calendarRef = ref(null)
    const events = ref([])
    const currentView = ref('dayGridMonth')
    const showEventModal = ref(false)
    const selectedEvent = ref(null)
    const isEditMode = ref(false)
    const currentTitle = ref('')
    const modalPosition = ref({ top: 0, left: 0, width: 0 })

    const availableViews = [
      { label: 'Month', value: 'dayGridMonth' },
      { label: 'Week', value: 'timeGridWeek' },
      { label: 'Day', value: 'timeGridDay' }
    ]

    // Load events from localStorage
    const loadEvents = () => {
      const savedEvents = localStorage.getItem('calendar-events')
      if (savedEvents) {
        events.value = JSON.parse(savedEvents)
      }
    }

    // Save events to localStorage
    const saveEvents = () => {
      localStorage.setItem('calendar-events', JSON.stringify(events.value))
    }

    // Load view mode from localStorage
    const loadViewMode = () => {
      const savedView = localStorage.getItem('calendar-view-mode')
      if (savedView && availableViews.find(v => v.value === savedView)) {
        currentView.value = savedView
      }
    }

    // Save view mode to localStorage
    const saveViewMode = () => {
      localStorage.setItem('calendar-view-mode', currentView.value)
    }

    // Call loadViewMode before creating calendarOptions
    loadViewMode();

    const calendarOptions = reactive({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: currentView.value,
      headerToolbar: false, // We'll use our own toolbar
      events: events,
      editable: true,
      droppable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      height: 'auto',
      nowIndicator: true,
      eventClick: handleEventClick,
      dateClick: handleDateClick,
      eventDrop: handleEventDrop,
      eventResize: handleEventResize,
      select: handleDateSelect,
      selectAllow: function(selectInfo) {
        // Only allow selecting future time slots
        return selectInfo.start > new Date()
      },
      datesSet: updateTitle,
      eventClassNames: () => ['custom-event'],
      eventContent: function(arg) {
        const bg = arg.event.extendedProps.color || arg.event.backgroundColor || '#3b82f6';
        return {
          html: `<div class='custom-event-inner' style='background:${bg};color:#fff;border-radius:6px;padding:2px 8px;width:100%;font-size:13px;font-weight:500;'>${arg.event.title}</div>`
        }
      }
    })

    function updateTitle(arg) {
      if (calendarRef.value) {
        currentTitle.value = calendarRef.value.getApi().view.title
      }
    }

    function goToToday() {
      if (calendarRef.value) {
        calendarRef.value.getApi().today()
        updateTitle()
      }
    }
    function goToPrev() {
      if (calendarRef.value) {
        calendarRef.value.getApi().prev()
        updateTitle()
      }
    }
    function goToNext() {
      if (calendarRef.value) {
        calendarRef.value.getApi().next()
        updateTitle()
      }
    }

    function handleEventClick(info) {
      // Capture the event element position and scroll at click moment
      const eventEl = info.el
      const rect = eventEl.getBoundingClientRect()
      const calendarApp = document.querySelector('.calendar-app')
      const calendarRect = calendarApp.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      modalPosition.value = {
        top: rect.bottom - calendarRect.top + 8,
        left: rect.left - calendarRect.left + (rect.width / 2) - 160, // Center the popover (320px width / 2)
        width: rect.width,
        scrollY: scrollY
      }
      
      selectedEvent.value = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        notes: info.event.extendedProps.notes || '',
        color: info.event.backgroundColor || '#3B82F6'
      }
      isEditMode.value = true
      showEventModal.value = true
    }

    function handleDateClick(info) {
      // Capture the date cell position and scroll at click moment
      const dateEl = info.dayEl
      const rect = dateEl.getBoundingClientRect()
      const calendarApp = document.querySelector('.calendar-app')
      const calendarRect = calendarApp.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      modalPosition.value = {
        top: rect.bottom - calendarRect.top + 8,
        left: rect.left - calendarRect.left + (rect.width / 2) - 160, // Center the popover (320px width / 2)
        width: rect.width,
        scrollY: scrollY
      }
      
      selectedEvent.value = {
        id: null,
        title: '',
        start: info.date,
        end: null,
        notes: '',
        color: '#3B82F6'
      }
      isEditMode.value = false
      showEventModal.value = true
    }

    function handleEventDrop(info) {
      const event = events.value.find(e => e.id === info.event.id)
      if (event) {
        event.start = info.event.start
        event.end = info.event.end
        saveEvents()
      }
    }

    function handleEventResize(info) {
      const event = events.value.find(e => e.id === info.event.id)
      if (event) {
        event.start = info.event.start
        event.end = info.event.end
        saveEvents()
      }
    }

    function handleDateSelect(info) {
      // Capture the selection element position for time slot clicks
      const selectionEl = info.view.el.querySelector('.fc-highlight')
      let rect
      let calendarApp
      let calendarRect
      
      if (selectionEl) {
        rect = selectionEl.getBoundingClientRect()
        calendarApp = document.querySelector('.calendar-app')
        calendarRect = calendarApp.getBoundingClientRect()
      } else {
        // Fallback: use the view element
        rect = info.view.el.getBoundingClientRect()
        calendarApp = document.querySelector('.calendar-app')
        calendarRect = calendarApp.getBoundingClientRect()
      }
      
      const scrollY = window.scrollY || window.pageYOffset
      modalPosition.value = {
        top: rect.bottom - calendarRect.top + 8,
        left: rect.left - calendarRect.left + (rect.width / 2) - 160, // Center the popover (320px width / 2)
        width: rect.width,
        scrollY: scrollY
      }
      
      selectedEvent.value = {
        id: null,
        title: '',
        start: info.start,
        end: info.end,
        notes: '',
        color: '#3B82F6'
      }
      isEditMode.value = false
      showEventModal.value = true
    }

    function changeView(view) {
      currentView.value = view
      if (calendarRef.value) {
        calendarRef.value.getApi().changeView(view)
        updateTitle()
      }
      saveViewMode()
    }

    function closeEventModal() {
      showEventModal.value = false
      selectedEvent.value = null
      isEditMode.value = false
    }

    function saveEvent(eventData) {
      if (isEditMode.value) {
        // Update existing event
        const index = events.value.findIndex(e => e.id === eventData.id)
        if (index !== -1) {
          events.value[index] = {
            ...events.value[index],
            ...eventData,
            updatedAt: new Date()
          }
        }
      } else {
        // Create new event
        const newEvent = {
          ...eventData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        events.value.push(newEvent)
      }
      
      saveEvents()
      closeEventModal()
      
      // Refresh calendar
      if (calendarRef.value) {
        calendarRef.value.getApi().refetchEvents()
      }
    }

    function deleteEvent(eventId) {
      events.value = events.value.filter(e => e.id !== eventId)
      saveEvents()
      closeEventModal()
      
      // Refresh calendar
      if (calendarRef.value) {
        calendarRef.value.getApi().refetchEvents()
      }
    }

    onMounted(() => {
      loadEvents()
      calendarOptions.initialView = currentView.value
      setTimeout(updateTitle, 0)
    })

    return {
      calendarRef,
      events,
      currentView,
      availableViews,
      showEventModal,
      selectedEvent,
      isEditMode,
      modalPosition,
      calendarOptions,
      changeView,
      closeEventModal,
      saveEvent,
      deleteEvent,
      goToToday,
      goToPrev,
      goToNext,
      currentTitle
    }
  }
}
</script>

<style scoped>
.calendar-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 0 520px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
}

.modal-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
}

.calendar-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 24px;
}
.toolbar-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}
.calendar-title {
  font-size: 18px;
  color: #374151;
  font-weight: 500;
  margin-bottom: 4px;
}
.nav-buttons-group {
  display: flex;
  gap: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  box-shadow: none;
  background: #fff;
  margin-bottom: 0;
}
.nav-btn {
  background: #fff;
  border: none;
  color: #444;
  font-weight: 500;
  font-size: 13px;
  padding: 4px 14px;
  cursor: pointer;
  transition: color 0.15s;
  outline: none;
  border-right: 1px solid #e5e7eb;
  border-radius: 0;
  height: 28px;
  min-width: 40px;
}
.nav-btn:last-child {
  border-right: none;
}
.nav-btn.today {
  color: #3B82F6;
  font-weight: 600;
  background: #fff;
}
.nav-btn:not(.today) {
  color: #444;
  background: #fff;
}
.nav-btn:focus {
  z-index: 1;
  position: relative;
  box-shadow: 0 0 0 2px #3B82F633;
}
.nav-btn:hover:not(.today) {
  color: #2563eb;
}
.toolbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.month-title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.02em;
}
.toolbar-right {
  display: flex;
  align-items: center;
}
.view-switcher-group {
  display: flex;
  gap: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  box-shadow: none;
  background: #fff;
}
.view-btn {
  background: #fff;
  border: none;
  color: #444;
  font-weight: 500;
  font-size: 13px;
  padding: 4px 14px;
  cursor: pointer;
  transition: color 0.15s;
  outline: none;
  border-right: 1px solid #e5e7eb;
  border-radius: 0;
  height: 28px;
  min-width: 40px;
}
.view-btn:last-child {
  border-right: none;
}
.view-btn.active {
  color: #3B82F6;
  background: #fff;
  font-weight: 600;
}
.view-btn:not(.active) {
  color: #444;
  background: #fff;
}
.view-btn:focus {
  z-index: 1;
  position: relative;
  box-shadow: 0 0 0 2px #3B82F633;
}
.view-btn:hover:not(.active) {
  color: #2563eb;
}

.calendar-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  overflow: hidden;
  padding: 8px 16px 24px 16px;
}

:deep(.fc) {
  background: #fff;
  border-radius: 12px;
  font-family: inherit;
}
:deep(.fc-scrollgrid),
:deep(.fc-scrollgrid-section),
:deep(.fc-scrollgrid-sync-table) {
  background: #fff;
}
:deep(.fc-col-header-cell) {
  color: #9ca3af;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: #f3f4f6;
  border: none;
  padding: 8px 0;
}
:deep(.fc-daygrid-day) {
  border: 1px solid #e5e7eb !important;
  background: #fff;
}
:deep(.fc-daygrid-day-number) {
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
  margin: 4px 0 0 4px;
}
:deep(.fc-day-other) {
  background: #f9fafb;
  color: #d1d5db;
}
:deep(.fc-daygrid-day-frame) {
  min-height: 80px;
}
:deep(.fc-daygrid-event) {
  margin-top: 4px;
  margin-bottom: 2px;
}
:deep(.custom-event) {
  /* background: #3b82f6 !important; */
  color: #fff !important;
  border-radius: 6px !important;
  border: none !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  box-shadow: none !important;
  width: 100%;
  transition: background 0.15s;
}
:deep(.custom-event-inner) {
  display: block;
  height: 100%;
}
:deep(.custom-event:hover) {
  background: transparent !important;
}
:deep(.fc-timegrid-event .fc-event-main) {
    padding: 0px;
}
:deep(.fc-list-event) {
  background: #3b82f6 !important;
  color: #fff !important;
  border-radius: 6px !important;
  border: none !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  box-shadow: none !important;
  padding: 2px 8px !important;
  margin-bottom: 6px;
}
:deep(.fc-list-event:hover) {
  background: #2563eb !important;
}
:deep(.fc-list-day-cushion) {
  background: #f3f4f6 !important;
  color: #6b7280 !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  font-size: 13px !important;
}
:deep(.fc-list-table) {
  border-radius: 8px !important;
  overflow: hidden !important;
}

:deep(.fc-timegrid-now-indicator-line) {
  border-top: 2px solid #3b82f6 !important;
  left: 0 !important;
  right: 0 !important;
  height: 0;
  z-index: 100 !important;
  position: absolute;
}
/* :deep(.fc-timegrid-now-indicator-line)::before {
  content: '';
  display: block;
  position: absolute;
  left: -5px;
  top: -6px;
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
  z-index: 12 !important;
} */

:deep(.fc-timegrid-now-indicator-arrow) {
  display: block !important;
  opacity: 1 !important;
  background: #3b82f6 !important;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  left: unset !important;
  right: -5px !important;
  position: absolute;
  box-shadow: none;
  pointer-events: auto;
}

:deep(.fc-timegrid-now-indicator-container) {
  overflow: visible !important;
}

/* Custom selection styling for time slots */
:deep(.fc-highlight) {
  background-color: rgba(59, 130, 246, 0.1) !important;
  border: 2px solid #3B82F6 !important;
  border-radius: 6px;
}

:deep(.fc-highlight-skeleton) {
  background-color: rgba(59, 130, 246, 0.1) !important;
}

:deep(.fc-timegrid-slot) {
  cursor: pointer;
}

:deep(.fc-timegrid-slot:hover) {
  background-color: rgba(59, 130, 246, 0.05);
}

/* Responsive */
@media (max-width: 900px) {
  .calendar-app {
    padding: 0;
  }
  .calendar-toolbar {
    flex-direction: column;
    gap: 12px;
    padding: 0 8px;
  }
  .toolbar-center {
    margin: 8px 0;
  }
  .calendar-container {
    padding: 0 2px 12px 2px;
  }
}
</style> 