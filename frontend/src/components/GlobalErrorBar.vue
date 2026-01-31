<script setup>
import { globalStore } from '@/stores/globalStore';
const { error } = globalStore;
</script>

<template>
  <div v-if="error" class="error-bar">
    <p>{{ error }}</p>
  </div>
</template>

<style scoped>
.error-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--error-bg);
  color: var(--error-text);
  text-align: center;
  padding: 8px;
  z-index: 9998;
  font-size: 0.9rem;
}
</style>
