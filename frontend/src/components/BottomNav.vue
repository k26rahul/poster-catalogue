<script setup>
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink to="/" class="nav-item">
      <span class="nav-icon">
        <Icon icon="mdi:home-outline" />
      </span>
      <span class="nav-label">Home</span>
    </RouterLink>

    <RouterLink to="/cart" class="nav-item">
      <span class="nav-icon">
        <Icon icon="mdi:cart-outline" />
      </span>
      <span class="nav-label">Cart</span>
    </RouterLink>

    <RouterLink to="/checkout" class="nav-item">
      <span class="nav-icon">
        <Icon icon="mdi:credit-card-outline" />
      </span>
      <span class="nav-label">Checkout</span>
    </RouterLink>

    <RouterLink to="/settings" class="nav-item">
      <span class="nav-icon">
        <Icon icon="mdi:cog-outline" />
      </span>
      <span class="nav-label">Settings</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rem;
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  border-top: 1px solid var(--nav-border);
  background-color: var(--nav-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.nav-item {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-3);
  transition: color var(--transition-fast);
}

.nav-item:hover {
  color: var(--text-1);
}

.nav-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.nav-icon :deep(svg) {
  font-size: 1.25rem;
}

.nav-label {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* Active state */
.router-link-active {
  color: var(--accent);
}

.router-link-active .nav-icon {
  background: var(--bg-accent-subtle);
}
</style>
