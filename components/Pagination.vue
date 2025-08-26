<template>
  <nav class="pager" role="navigation" aria-label="Pagination">
    <button class="btn" :disabled="page <= 1 || loading" @click="$emit('prev')">Prev</button>

    <div class="info">
      <label class="sr-only" for="page-input">Current page</label>
      <input
        id="page-input"
        class="page-input"
        type="number"
        min="1"
        :max="totalPages || 1"
        :value="page"
        :disabled="loading"
        @change="onGoTo($event)"
      />
      <span class="total">/ {{ totalPages || 1 }}</span>
    </div>

    <button class="btn" :disabled="page >= totalPages || loading" @click="$emit('next')">Next</button>
  </nav>
</template>

<script setup>
const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['prev', 'next', 'go'])
const onGoTo = (e) => {
  const val = Number(e?.target?.value || 1)
  emit('go', isNaN(val) ? 1 : val)
}
</script>

<style scoped lang="scss">
.pager {
  display: flex; align-items: center; gap: 12px; justify-content: center;
  padding: 16px 0; flex-wrap: wrap;
}
.btn {
  padding: 8px 14px; border-radius: 6px; border: 1px solid #444; background: #222; color: #fff;
  cursor: pointer;
}
.btn:disabled { opacity: .5; cursor: not-allowed; }
.info { display: inline-flex; align-items: center; gap: 8px; color: #ddd; }
.page-input {
  width: 72px; padding: 8px; border-radius: 6px; border: 1px solid #444; background: #111; color: #fff; text-align: center;
}
.total { color: #aaa; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
</style>
