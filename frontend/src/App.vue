<script setup>
import { RouterView } from 'vue-router';
import BottomNav from './components/BottomNav.vue';
</script>

<template>
  <main>
    <RouterView />
  </main>

  <BottomNav />
</template>

<style>
main {
  padding-bottom: 64px; /* space for bottom nav */
}
</style>
