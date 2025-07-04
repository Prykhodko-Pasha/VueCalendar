<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">&#10005;</button>
      <EventForm :event="event" @save="onSave" @cancel="$emit('close')" ref="eventForm" />
      <div class="modal-actions">
        <button v-if="event && event.id" class="discard-btn" @click="onDiscard">Discard</button>
        <button v-if="event && event.id" class="edit-btn" @click="onEdit">Edit</button>
      </div>
    </div>
  </div>
</template>

<script>
import EventForm from './EventForm.vue';

export default {
  name: 'EventModal',
  components: { EventForm },
  props: {
    visible: { type: Boolean, default: false },
    event: { type: Object, default: null }
  },
  methods: {
    onSave(eventData) {
      this.$emit('save', eventData);
      this.$emit('close');
    },
    onEdit() {
      // Call save on the form
      this.$refs.eventForm.onSubmit();
    },
    onDiscard() {
      this.$emit('delete', this.event.id);
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  min-width: 400px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.12);
  position: relative;
}
.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.3em;
  cursor: pointer;
  color: #6b7280;
  z-index: 2;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}
.edit-btn {
  margin-left: auto;
}
.discard-btn {
  margin-right: auto;
}
</style> 