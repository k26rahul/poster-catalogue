<script setup>
import { ref } from 'vue';

const props = defineProps({
  poster: { type: Object, required: true },
});

const added = ref(false);
const qty = ref(1);

function addToCart() {
  added.value = true;
  qty.value = 1;
}

function increment() {
  qty.value += 1;
}

function decrement() {
  if (qty.value > 1) qty.value -= 1;
}
</script>

<template>
  <div class="poster-card">
    <img :src="`/poster-images/${poster.image_file}`" :alt="poster.code || 'poster'" />

    <div class="meta">
      <div class="title">{{ poster.code || `Page ${poster.page_no}` }}</div>

      <div class="actions">
        <button v-if="!added" class="add-btn" @click="addToCart">Add to cart</button>

        <div v-else class="qty">
          <button class="qty-btn" @click="decrement">−</button>
          <div class="qty-val">{{ qty }}</div>
          <button class="qty-btn" @click="increment">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poster-card {
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.poster-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
}

.meta {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.title {
  flex: 1 1 auto;
  text-align: left;
  color: #333;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  display: flex;
  align-items: center;
}

.add-btn {
  background: #1f6feb;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.qty-btn {
  background: transparent;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 1.1rem;
}

.qty-val {
  min-width: 36px;
  text-align: center;
  padding: 6px 4px;
}
</style>
