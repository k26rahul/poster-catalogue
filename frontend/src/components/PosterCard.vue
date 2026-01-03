<script setup>
import { computed } from 'vue';
import { useCart } from '@/composables/useCart';

const props = defineProps({
  poster: { type: Object, required: true },
});

const { cart, addPoster, removePoster } = useCart();

const pdfName = computed(() => props.poster.pdf_name);

const qty = computed(() => {
  const postersMap = cart.value.get(pdfName.value);
  const found = postersMap?.get(props.poster.code);
  return found ? found.quantity : 0;
});

const isActive = computed(() => qty.value >= 1);

const inc = e => {
  e.stopPropagation();
  addPoster(pdfName.value, props.poster);
};

const dec = e => {
  e.stopPropagation();
  if (qty.value > 0) {
    removePoster(pdfName.value, props.poster.code);
  }
};
</script>

<template>
  <div class="poster-card">
    <div class="image-wrap">
      <img :src="`/poster-images/${poster.image_file}`" :alt="poster.code" />

      <div class="qty-overlay" :class="{ active: isActive }">
        <div class="qty-left" :class="{ visible: isActive }">
          <button @click="dec">−</button>
          <span>{{ qty }}</span>
        </div>

        <button class="qty-plus" @click="inc">+</button>
      </div>
    </div>

    <div class="title">
      {{ poster.code }}
    </div>
  </div>
</template>

<style scoped>
.poster-card {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: var(--card-bg);
}

.image-wrap {
  position: relative;
}

.image-wrap img {
  width: 100%;
  height: 220px;
  border-radius: 6px;
  object-fit: contain;
  background: var(--image-bg);
}

.qty-overlay {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  overflow: hidden;
}

.qty-overlay.active {
  background: var(--accent);
  box-shadow: 0 4px 10px var(--shadow-hover);
}

.qty-left {
  display: flex;
  align-items: center;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width 0.2s ease, opacity 0.15s ease;
}

.qty-left.visible {
  max-width: 120px;
  opacity: 1;
}

.qty-left button {
  padding: 8px 12px;
  border: none;
  background: transparent;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}

.qty-left span {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
  color: #fff;
}

.qty-plus {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 2px solid transparent;
  background: white;
  font-size: 26px;
  color: var(--accent);
  cursor: pointer;
  flex-shrink: 0;
}

.qty-overlay.active .qty-plus {
  background: transparent;
  color: #fff;
}

.title {
  margin-top: 6px;
  font-size: 0.9rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
