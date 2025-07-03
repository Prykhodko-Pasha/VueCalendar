<template>
  <form class="event-form" @submit.prevent="onSubmit">
    <div class="form-group">
      <label for="name">Event Name</label>
      <input id="name" v-model="form.name" maxlength="30" required />
      <span v-if="errors.name" class="error">{{ errors.name }}</span>
    </div>
    <div class="form-group">
      <label for="date">Event Date</label>
      <input id="date" type="date" v-model="form.date" :min="today" required />
      <span v-if="errors.date" class="error">{{ errors.date }}</span>
    </div>
    <div class="form-group">
      <label for="time">Event Time</label>
      <input id="time" type="time" v-model="form.time" required />
      <span v-if="errors.time" class="error">{{ errors.time }}</span>
    </div>
    <div class="form-group">
      <label for="notes">Notes</label>
      <textarea id="notes" v-model="form.notes" maxlength="3000" required></textarea>
      <span v-if="errors.notes" class="error">{{ errors.notes }}</span>
    </div>
    <div class="form-group">
      <label>Color</label>
      <input type="color" v-model="form.color" />
      <span v-if="errors.color" class="error">{{ errors.color }}</span>
    </div>
    <div class="form-actions">
      <button type="button" @click="$emit('cancel')">Cancel</button>
      <button type="submit">Save</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'EventForm',
  props: {
    event: Object // for editing
  },
  data() {
    return {
      form: {
        name: this.event?.name || '',
        date: this.event?.date || '',
        time: this.event?.time || '',
        notes: this.event?.notes || '',
        color: this.event?.color || '#3B82F6',
      },
      errors: {},
      today: new Date().toISOString().slice(0, 10)
    };
  },
  methods: {
    validate() {
      const errors = {};
      if (!this.form.name) errors.name = 'Event name is required.';
      else if (this.form.name.length > 30) errors.name = 'Max 30 characters.';
      if (!this.form.date) errors.date = 'Date is required.';
      else if (this.form.date < this.today) errors.date = 'Date cannot be in the past.';
      if (!this.form.time) errors.time = 'Time is required.';
      else if (this.form.date === this.today && this.form.time < new Date().toTimeString().slice(0,5)) errors.time = 'Time cannot be in the past.';
      if (!this.form.notes) errors.notes = 'Notes are required.';
      else if (this.form.notes.length > 3000) errors.notes = 'Max 3000 characters.';
      if (!this.form.color) errors.color = 'Color is required.';
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    onSubmit() {
      if (this.validate()) {
        this.$emit('save', { ...this.form });
      }
    }
  }
};
</script>

<style scoped>
.event-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.error {
  color: #ef4444;
  font-size: 0.9em;
}
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style> 