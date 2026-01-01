<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  pdf: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goToPdf = () => {
  router.push({
    name: 'pdf',
    params: {
      pdfName: props.pdf.id,
    },
  });
};
</script>

<template>
  <div class="pdf-card" @click="goToPdf">
    <img :src="`/poster-images/${pdf.thumbnail}`" :alt="pdf.id" />

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
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
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
