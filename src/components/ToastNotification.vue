<template>
    <Transition name="toast">
      <div 
        v-if="isVisible" 
        class="toast-notification"
        :class="notificationType"
      >
        <span class="toast-icon">{{ icon }}</span>
        <span class="toast-message">{{ message }}</span>
        <button @click="close" class="toast-close">×</button>
      </div>
    </Transition>
  </template>
  
  <script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';

/**
 * Toast Notification Component
 * Displays temporary notifications with different states and auto-dismiss functionality.
 * Supports success, error, and info states with custom icons and messages.
 */

/**
 * Component Props
 */
const props = defineProps({
  /** Controls the visibility of the toast notification */
  show: {
    type: Boolean,
    default: false
  },
  /** The message to display in the notification */
  message: {
    type: String,
    required: true
  },
  /** The type of notification: 'success', 'error', or 'info' */
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'info'].includes(value)
  },
  /** Optional icon to display before the message */
  icon: {
    type: String,
    default: ''
  },
  /** Duration in milliseconds before auto-dismissing. Set to 0 to disable auto-dismiss */
  duration: {
    type: Number,
    default: 3000
  }
});

/**
 * Event Emits Declaration
 * @emits {boolean} update:show - Emitted when the toast visibility changes (v-model support)
 * @emits {void} close - Emitted when the toast is closed
 */
const emit = defineEmits(['update:show', 'close']);

// Internal reactive state
const isVisible = ref(false);
let timer = null;

/**
 * Computed class bindings for different notification types
 * @returns {Object} Object containing class bindings
 */
const notificationType = computed(() => ({
  'success': props.type === 'success',
  'error': props.type === 'error',
  'info': props.type === 'info'
}));

/**
 * Closes the notification and emits necessary events
 * @fires update:show
 * @fires close
 */
const close = () => {
  isVisible.value = false;
  emit('update:show', false);
  emit('close');
};

/**
 * Starts the auto-dismiss timer if duration is set
 * Clears any existing timer before starting a new one
 */
const startTimer = () => {
  if (props.duration) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      close();
    }, props.duration);
  }
};

/**
 * Watch for changes in show prop to handle visibility
 * If shown, starts the auto-dismiss timer
 */
watch(() => props.show, (newVal) => {
  isVisible.value = newVal;
  if (newVal) {
    startTimer();
  }
});

/**
 * Lifecycle Hooks
 */

/**
 * On component mount, initialize visibility if show prop is true
 */
onMounted(() => {
  if (props.show) {
    isVisible.value = true;
    startTimer();
  }
});

/**
 * Cleanup timer when component is unmounted to prevent memory leaks
 */
onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>

<style scoped>
/**
 * Toast Notification Styles
 * Organized into sections:
 * 1. Base Container
 * 2. Type Variants
 * 3. Close Button
 * 4. Transitions
 * 5. Responsive Design
 */

/* Base Container */
.toast-notification {
  /* Positioned fixed at the bottom center of the viewport */
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  
  /* Layout */
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  
  /* Appearance */
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 400px;
  width: calc(100% - 4rem);
  border: 1px solid #e0e0e0;
}

/* Type Variants - Color indicators */
.toast-notification.success {
  border-left: 4px solid #4caf50;  /* Green */
}

.toast-notification.error {
  border-left: 4px solid #f44336;  /* Red */
}

.toast-notification.info {
  border-left: 4px solid #2196f3;  /* Blue */
}

/* Close Button */
.toast-close {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  color: #666;
}

/* Animation Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px) translateX(-50%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .toast-notification {
    width: calc(100% - 2rem);
  }
}

@media (max-width: 480px) {
  .toast-notification {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
}
</style>