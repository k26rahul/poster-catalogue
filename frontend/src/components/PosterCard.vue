<script setup>
import { computed } from 'vue';
import { cartStore } from '@/stores/cartStore';
import QuantitySelector from './QuantitySelector.vue';

const props = defineProps({
  poster: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['toggle-zoom']);

const { cart } = cartStore;

const pdfName = computed(() => props.poster.pdfName);

const qty = computed(() => {
  return cart.get(pdfName.value)?.get(props.poster.id)?.qty || 0;
});

const isActive = computed(() => qty.value >= 1);
</script>

<template>
  <article class="poster-card" :class="{ selected: isActive }">
    <!-- Image Container -->
    <div class="image-container">
      <img
        :src="`/poster-images/${poster.imageFile}`"
        :alt="poster.id"
        @click="emit('toggle-zoom', poster)"
      />

      <!-- Index Badge -->
      <span v-if="index" class="index-badge">#{{ index }}</span>

      <!-- Quantity Controls -->
      <QuantitySelector
        class="qty-position"
        :poster-id="poster.id"
        :pdf-name="pdfName"
        variant="compact"
      />
    </div>

    <!-- Card Footer -->
    <div class="card-footer">
      <span class="poster-code">{{ poster.code }}</span>
    </div>
  </article>
</template>

<style scoped>
.poster-card {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.poster-card:hover {
  box-shadow: var(--shadow-md);
}

.poster-card.selected {
  border-color: transparent;
  box-shadow:
    0 0 0 2px var(--accent-light),
    0 5px 0 2px var(--accent-light);
}

/* Image Container */
.image-container {
  position: relative;
  background: var(--bg-1);
}

.poster-card img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  cursor: zoom-in;
}

/* Index Badge */
.index-badge {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-2);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

/* Quantity Selector Position */
.qty-position {
  position: absolute;
  bottom: 0;
  right: 0;
}

/* Card Footer */
.card-footer {
  padding: var(--space-md);
  text-align: center;
  background: var(--bg-4);
  border-top: 1px solid var(--border-3);
}

.poster-code {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
