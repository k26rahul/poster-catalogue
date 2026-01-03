<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  pdf: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const current = ref(0);

const posters = props.pdf.posters_sample;

const goToPdf = () => {
  router.push({
    name: 'pdf',
    params: {
      pdfName: props.pdf.id,
    },
  });
};

let startX = 0;

const onTouchStart = e => {
  startX = e.touches[0].clientX;
};

const onTouchEnd = e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) < 40) return;

  if (dx < 0 && current.value < posters.length - 1) {
    current.value++;
  } else if (dx > 0 && current.value > 0) {
    current.value--;
  }
};
</script>

<template>
  <div class="pdf-card" @click="goToPdf" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <img :src="`/poster-images/${posters[current].image_file}`" :alt="pdf.id" />

    <div class="dots">
      <span
        v-for="(_, i) in posters"
        :key="i"
        :class="{ active: i === current }"
        @click.stop="current = i"
      />
    </div>

    <h3>{{ pdf.id.replace(/_/g, ' ') }}</h3>
    <p>{{ pdf.total_posters }} posters</p>
  </div>
</template>

<style scoped>
.pdf-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: var(--card-bg);
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.pdf-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-hover);
}

.pdf-card img {
  width: 100%;
  height: 220px;
  border-radius: 6px;
  object-fit: contain;
  background: var(--image-bg);
}

.dots {
  display: flex;
  gap: 6px;
  margin: 8px 0 4px;
}

.dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dot-bg);
}

.dots span.active {
  background: var(--dot-active);
}

.pdf-card h3 {
  margin: 6px 0 4px;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.pdf-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
