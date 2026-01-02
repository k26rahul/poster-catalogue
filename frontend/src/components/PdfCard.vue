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
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.pdf-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.pdf-card img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-radius: 6px;
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
  background: #ccc;
}

.dots span.active {
  background: #333;
}

.pdf-card h3 {
  margin: 6px 0 4px;
  font-size: 0.95rem;
  color: #333;
}

.pdf-card p {
  margin: 0;
  color: #777;
  font-size: 0.85rem;
}
</style>
