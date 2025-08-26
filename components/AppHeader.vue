<template>
  <header class="app-header">
    <div class="nav-container">
      <NuxtLink to="/" class="brand">MovieApp</NuxtLink>

      <!-- Hamburger icon (visible on mobile) -->
      <button class="menu-toggle" @click="isOpen = !isOpen">
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
      </button>

      <!-- Nav links -->
      <nav class="nav" :class="{ open: isOpen }">
        <!-- <NuxtLink to="/" class="nav-link" @click="isOpen = false">Home</NuxtLink> -->
        <NuxtLink to="/" class="nav-link" @click="isOpen = false">Movies</NuxtLink>
        <NuxtLink to="/favorites" class="nav-link" @click="isOpen = false">favorites</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
</script>

<style scoped>
.app-header {
  padding: 10px 16px;
  background: #333;
  color: white;
}
.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  font-weight: bold;
  color: white;
  text-decoration: none;
  font-size: 18px;
}

/* Nav links */
.nav {
  display: flex;
  gap: 20px;
}
.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background 0.2s;
}
.nav-link:hover {
  background: #444;
}

/* Hamburger menu */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.menu-toggle span {
  display: block;
  height: 3px;
  width: 100%;
  background: white;
  border-radius: 2px;
  transition: 0.3s;
}

/* Animate when open */
.menu-toggle span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.menu-toggle span.open:nth-child(2) {
  opacity: 0;
}
.menu-toggle span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile styles */
@media (max-width: 600px) {
  .menu-toggle {
    display: flex;
  }
  .nav {
    display: none;
    flex-direction: column;
    background: #333;
    position: absolute;
    top: 60px;
    right: 16px;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  }
  .nav.open {
    display: flex;
  }
}
</style>
