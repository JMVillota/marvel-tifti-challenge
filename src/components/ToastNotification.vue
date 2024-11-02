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
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error', 'info'].includes(value)
    },
    icon: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 3000
    }
  });
  
  const emit = defineEmits(['update:show', 'close']);
  
  const isVisible = ref(false);
  let timer = null;
  
  const notificationType = computed(() => ({
    'success': props.type === 'success',
    'error': props.type === 'error',
    'info': props.type === 'info'
  }));
  
  const close = () => {
    isVisible.value = false;
    emit('update:show', false);
    emit('close');
  };
  
  const startTimer = () => {
    if (props.duration) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        close();
      }, props.duration);
    }
  };
  
  watch(() => props.show, (newVal) => {
    isVisible.value = newVal;
    if (newVal) {
      startTimer();
    }
  });
  
  onMounted(() => {
    if (props.show) {
      isVisible.value = true;
      startTimer();
    }
  });
  
  onBeforeUnmount(() => {
    clearTimeout(timer);
  });
  </script>
  
  <style scoped>
  .toast-notification {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-width: 400px;
    width: calc(100% - 4rem);
    border: 1px solid #e0e0e0;
  }
  
  .toast-notification.success {
    border-left: 4px solid #4caf50;
  }
  
  .toast-notification.error {
    border-left: 4px solid #f44336;
  }
  
  .toast-notification.info {
    border-left: 4px solid #2196f3;
  }
  
  .toast-close {
    margin-left: auto;
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem;
    color: #666;
  }
  
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }
  
  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateY(30px) translateX(-50%);
  }
  
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