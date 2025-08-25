<!-- layouts/default.vue -->
<template>
  <div>
    <!-- Header -->
    <AppHeader />

    <!-- Page content -->
    <main style="padding:20px;">
      <slot />
    </main>

    <!-- Footer -->
    <footer style="padding:10px; background:#eee;">
      <small>© 2025 My Nuxt App</small>
    </footer>
  </div>
</template>

<script setup>
import AppHeader from '~/components/AppHeader.vue';
</script>
