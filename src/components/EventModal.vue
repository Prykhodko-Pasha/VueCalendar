<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">×</button>
      <form @submit.prevent="handleSubmit" class="event-form">
        <input
          v-model="formData.title"
          type="text"
          maxlength="30"
          required
          :class="{ error: errors.title }"
          placeholder="event name"
          class="input-field"
        />
        <div class="input-icon-group">
          <input
            ref="dateInput"
            v-model="formData.date"
            type="date"
            required
            :class="{ error: errors.date }"
            :min="today"
            placeholder="event date"
            class="input-field hide-native-icon"
          />
          <button type="button" class="icon right clickable" @click="focusDateInput" tabindex="-1">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#B0B3B8" stroke-width="2" d="M8 2v2m8-2v2M3 8h18M5 21h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2Z"/></svg>
          </button>
        </div>
        <div class="input-icon-group">
          <input
            ref="timeInput"
            v-model="formData.time"
            type="time"
            required
            :class="{ error: errors.time }"
            placeholder="event time"
            class="input-field hide-native-icon"
          />
          <button type="button" class="icon right clickable" @click="focusTimeInput" tabindex="-1">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#B0B3B8" stroke-width="2"/><path stroke="#B0B3B8" stroke-width="2" stroke-linecap="round" d="M12 7v5l3 3"/></svg>
          </button>
        </div>
        <textarea
          v-model="formData.notes"
          maxlength="3000"
          required
          :class="{ error: errors.notes }"
          placeholder="notes"
          rows="2"
          class="input-field"
        ></textarea>
        <div class="color-picker-row">
          <div class="color-picker">
            <div
              v-for="color in availableColors"
              :key="color"
              :class="['color-option', { active: formData.color === color }]"
              :style="{ backgroundColor: color }"
              @click="formData.color = color"
            ></div>
            <input
              v-model="formData.color"
              type="color"
              class="color-input"
              :class="{ error: errors.color }"
            />
          </div>
          <span v-if="errors.color" class="error-message">{{ errors.color }}</span>
        </div>
        <div class="form-actions">
          <button v-if="isEdit" type="button" class="btn-discard" @click="handleDelete">Discard</button>
          <button v-else type="button" class="btn-cancel" @click="closeModal">Cancel</button>
          <button v-if="isEdit" type="submit" class="btn-edit">Edit</button>
          <button v-else type="submit" class="btn-save">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'

export default {
  name: 'EventModal',
  props: {
    event: {
      type: Object,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'save', 'delete'],
  setup(props, { emit }) {
    const formData = reactive({
      id: null,
      title: '',
      date: '',
      time: '',
      notes: '',
      color: '#3B82F6'
    })

    const errors = reactive({
      title: '',
      date: '',
      time: '',
      notes: '',
      color: ''
    })

    const availableColors = [
      '#3B82F6', // Blue
      '#EF4444', // Red
      '#10B981', // Green
      '#F59E0B', // Orange
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#06B6D4', // Teal
      '#A16207', // Brown
    ]

    const today = computed(() => {
      const now = new Date()
      return now.toISOString().split('T')[0]
    })

    const dateInput = ref(null)
    const timeInput = ref(null)

    function focusDateInput() {
      dateInput.value && dateInput.value.focus()
      dateInput.value && dateInput.value.click && dateInput.value.click()
    }
    function focusTimeInput() {
      timeInput.value && timeInput.value.focus()
      timeInput.value && timeInput.value.click && timeInput.value.click()
    }

    watch(() => props.event, (newEvent) => {
      if (newEvent) {
        formData.id = newEvent.id
        formData.title = newEvent.title || ''
        formData.notes = newEvent.notes || ''
        formData.color = newEvent.color || '#3B82F6'
        if (newEvent.start) {
          let date = '', time = '';
          if (typeof newEvent.start === 'string') {
            [date, time] = newEvent.start.split('T');
            time = time ? time.slice(0, 5) : '';
          } else if (newEvent.start instanceof Date) {
            date = newEvent.start.getFullYear().toString().padStart(4, '0') + '-' +
                   (newEvent.start.getMonth() + 1).toString().padStart(2, '0') + '-' +
                   newEvent.start.getDate().toString().padStart(2, '0');
            time = newEvent.start.toTimeString().slice(0, 5);
          }
          formData.date = date;
          formData.time = time;
        } else {
          formData.date = ''
          formData.time = ''
        }
      }
    }, { immediate: true })

    function validateForm() {
      let isValid = true
      Object.keys(errors).forEach(key => { errors[key] = '' })
      if (!formData.title.trim()) {
        errors.title = 'Event name is required'
        isValid = false
      } else if (formData.title.length > 30) {
        errors.title = 'Event name must be 30 characters or less'
        isValid = false
      }
      if (!formData.date) {
        errors.date = 'Event date is required'
        isValid = false
      } else {
        const selectedDate = new Date(formData.date + 'T00:00:00')
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
          errors.date = 'Cannot select a past date'
          isValid = false
        }
      }
      if (!formData.time) {
        errors.time = 'Event time is required'
        isValid = false
      } else {
        if (formData.date === today.value) {
          const now = new Date()
          const selectedDateTime = new Date(formData.date + 'T' + formData.time)
          if (selectedDateTime < now) {
            errors.time = 'Cannot select a past time for today'
            isValid = false
          }
        }
      }
      if (!formData.notes.trim()) {
        errors.notes = 'Notes are required'
        isValid = false
      } else if (formData.notes.length > 3000) {
        errors.notes = 'Notes must be 3000 characters or less'
        isValid = false
      }
      if (!formData.color) {
        errors.color = 'Color is required'
        isValid = false
      }
      return isValid
    }

    function handleSubmit() {
      if (!validateForm()) return
      const eventData = {
        id: formData.id,
        title: formData.title.trim(),
        start: formData.date + 'T' + formData.time,
        notes: formData.notes.trim(),
        color: formData.color,
        backgroundColor: formData.color,
        textColor: '#FFFFFF'
      }
      emit('save', eventData)
    }

    function handleDelete() {
      emit('delete', formData.id)
    }

    function closeModal() {
      emit('close')
    }

    return {
      formData,
      errors,
      availableColors,
      today,
      handleSubmit,
      handleDelete,
      closeModal,
      dateInput,
      timeInput,
      focusDateInput,
      focusTimeInput
    }
  }
}
</script>

<style scoped>
.hide-native-icon::-webkit-calendar-picker-indicator {
  opacity: 0;
  display: none;
}
.hide-native-icon::-webkit-input-placeholder {
  color: #b0b3b8;
}
.hide-native-icon::-moz-placeholder {
  color: #b0b3b8;
}
.hide-native-icon:-ms-input-placeholder {
  color: #b0b3b8;
}
.hide-native-icon::placeholder {
  color: #b0b3b8;
}
.hide-native-icon[type="date"]::-webkit-input-placeholder,
.hide-native-icon[type="time"]::-webkit-input-placeholder {
  color: #b0b3b8;
}
.hide-native-icon[type="date"]::-webkit-clear-button,
.hide-native-icon[type="date"]::-webkit-inner-spin-button,
.hide-native-icon[type="date"]::-webkit-calendar-picker-indicator,
.hide-native-icon[type="time"]::-webkit-clear-button,
.hide-native-icon[type="time"]::-webkit-inner-spin-button,
.hide-native-icon[type="time"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}
.hide-native-icon[type="date"],
.hide-native-icon[type="time"] {
  position: relative;
  z-index: 2;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 18px;
  border: 1.5px solid #d1d5db;
  box-shadow: 0 8px 32px rgba(60,60,90,0.10);
  width: 320px;
  padding: 28px 24px 18px 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #d1d5db;
  background: #fff;
  color: #888;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, border 0.15s;
  z-index: 2;
}
.close-button:hover {
  background: #f3f4f6;
  border-color: #b0b3b8;
}
.event-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.input-field {
  border: none;
  border-bottom: 1.5px solid #e5e7eb;
  background: transparent;
  font-size: 15px;
  color: #222;
  padding: 8px 0 6px 0;
  outline: none;
  margin-bottom: 0;
  width: 100%;
  transition: border-color 0.15s;
}
.input-field::placeholder {
  color: #b0b3b8;
  font-weight: 400;
  font-size: 15px;
}
.input-field:focus {
  border-bottom: 1.5px solid #3B82F6;
}
.input-field.error {
  border-bottom: 1.5px solid #EF4444;
}
.input-icon-group {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon-group .input-field {
  padding-right: 32px;
  margin-bottom: 0;
}
.icon.right {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
}
.icon.right.clickable {
  pointer-events: auto;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon.right.clickable:active {
  background: #f3f4f6;
  border-radius: 50%;
}
.color-picker-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
}
.color-picker {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.color-option {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}
.color-option:hover {
  transform: scale(1.1);
}
.color-option.active {
  border-color: #1F2937;
  transform: scale(1.1);
}
.color-input {
  width: 24px !important;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}
.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 0 2px;
}
.btn-cancel {
  background: none;
  border: none;
  color: #EF4444;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.btn-cancel:hover {
  color: #b91c1c;
}
.btn-save {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.btn-save:hover {
  color: #3B82F6;
}
.btn-discard {
  background: none;
  border: none;
  color: #EF4444;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.btn-discard:hover {
  color: #b91c1c;
}
.btn-edit {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.btn-edit:hover {
  color: #3B82F6;
}
.error-message {
  color: #EF4444;
  font-size: 12px;
  margin-top: 2px;
  display: block;
}
</style> 