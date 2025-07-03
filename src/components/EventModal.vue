<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <EventForm :event="event" @save="onSave" @cancel="$emit('close')" />
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
}
</style> 