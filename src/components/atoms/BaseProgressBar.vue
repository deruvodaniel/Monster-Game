<template>
  <div :class="[$style.progressBar, $style[`progressBar--${type}`]]">
    <div 
      :class="$style.progressFill"
      :style="{ width: `${percentage}%` }"
    ></div>
    <div :class="$style.progressText">
      {{ value }} / {{ max }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'health', 'stamina'].includes(value)
  }
})

const percentage = computed(() => {
  return Math.max(0, Math.min(100, (props.value / props.max) * 100))
})
</script>

<style module>
.progressBar {
  position: relative;
  height: 24px;
  background: var(--surface-color);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
}

.progressBar--health .progressFill {
  background: linear-gradient(90deg, #ef4444, #22c55e);
}

.progressBar--stamina .progressFill {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

.progressText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-family: 'Roboto Mono', monospace;
}
</style>