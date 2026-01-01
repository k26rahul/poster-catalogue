<script setup>
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';
</script>

<template>
  <nav>
    <RouterLink to="/" class="nav-item">
      <Icon icon="mdi:home-outline" />
      <span>Home</span>
    </RouterLink>

    <RouterLink to="/cart" class="nav-item">
      <Icon icon="mdi:cart-outline" />
      <span>Cart</span>
    </RouterLink>

    <RouterLink to="/history" class="nav-item">
      <Icon icon="mdi:history" />
      <span>History</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  border-top: 1px solid #ddd;
  background-color: #fff;
}

.nav-item {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 12px;
  text-decoration: none;
  color: #555;
}

.nav-item :deep(svg) {
  font-size: 20px;
}

.nav-item span {
  margin-top: 4px;
}

.router-link-active {
  color: DodgerBlue;
}
</style>
