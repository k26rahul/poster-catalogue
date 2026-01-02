<script setup>
import { ref } from 'vue';

const props = defineProps({
  poster: { type: Object, required: true },
});

const qty = ref(0);

const inc = e => {
  e.stopPropagation();
  qty.value += 1;
};

const dec = e => {
  e.stopPropagation();
  if (qty.value > 0) qty.value -= 1;
};
</script>

<template>
  <div class="poster-card">
    <div class="image-wrap">
      <img :src="`/poster-images/${poster.image_file}`" :alt="poster.code || 'poster'" />

      <div class="qty-overlay" :class="{ active: qty >= 1 }">
        <!-- LEFT PART (− qty) -->
        <div class="qty-left" :class="{ visible: qty >= 1 }">
          <button @click="dec">−</button>
          <span>{{ qty }}</span>
        </div>

        <!-- RIGHT PART (+ always visible) -->
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
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  padding: 8px;
}

/* IMAGE */
.image-wrap {
  position: relative;
}

.image-wrap img {
  width: 100%;
  height: 220px;
  object-fit: contain;
  border-radius: 8px;
  background: #f4f4f4;
}

/* QTY OVERLAY */
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
  background: #ff2f6d;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
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
  background: transparent;
  border: none;
  font-size: 20px;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
}

.qty-left span {
  min-width: 24px;
  color: white;
  text-align: center;
  font-weight: 600;
}

.qty-plus {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: #ff2f6d;
  font-size: 26px;
  border: 2px solid #ff2f6d;
  cursor: pointer;
  flex-shrink: 0;
}

.qty-overlay.active .qty-plus {
  color: white;
  background: transparent;
}

.title {
  margin-top: 6px;
  font-size: 0.9rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
