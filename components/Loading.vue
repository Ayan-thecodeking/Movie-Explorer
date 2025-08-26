<!-- components/Loading.vue -->
<template>
  <div
    class="loading"
    :class="[{ overlay: fullscreen }, theme]"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div class="spinner" :style="spinnerStyle"></div>
    <p v-if="message" class="msg">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: { type: String, default: 'Loading…' },
  size: { type: Number, default: 40 },          // spinner diameter (px)
  thickness: { type: Number, default: 4 },       // border width (px)
  speed: { type: Number, default: 900 },         // ms per spin
  color: { type: String, default: '#ffffff' },   // spinner color
  track: { type: String, default: 'rgba(255,255,255,0.2)' }, // track color
  fullscreen: { type: Boolean, default: false }, // show as centered overlay
  theme: { type: String, default: '' },          // e.g., 'dark' or 'light' (optional)
})

const spinnerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderWidth: `${props.thickness}px`,
  borderTopColor: props.color,
  borderRightColor: props.track,
  borderBottomColor: props.track,
  borderLeftColor: props.track,
  animationDuration: `${props.speed}ms`,
}))
</script>

<style scoped>
.loading {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #fff;
}

.loading.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: grid;
  place-items: center;
  z-index: 9999;
}

.spinner {
  border-style: solid;
  border-radius: 50%;
  animation: spin linear infinite;
}

.msg {
  font-size: 14px;
  opacity: 0.9;
}

/* Optional themes */
.loading.light { color: #111; }
.loading.light .spinner {
  border-right-color: rgba(0,0,0,0.15);
  border-bottom-color: rgba(0,0,0,0.15);
  border-left-color: rgba(0,0,0,0.15);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
