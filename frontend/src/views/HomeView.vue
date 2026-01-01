<script setup>
import { computed, onMounted } from 'vue';
import { usePdfsMetadata } from '../composables/usePdfsMetadata';
import PdfCard from '../components/PdfCard.vue';

const { metadata, isLoading, error, fetchMetadata } = usePdfsMetadata();

onMounted(fetchMetadata);

const groupedByCategory = computed(() => {
  if (!metadata.value) return [];

  const { pdfs, categories } = metadata.value;

  return categories.map(cat => ({
    name: cat.name,
    description: cat.description,
    pdfs: pdfs.filter(pdf => pdf.category === cat.name),
  }));
});
</script>

<template>
  <section v-if="isLoading">Loading...</section>

  <section v-else-if="error">Error: {{ error }}</section>

  <section v-else>
    <section v-for="category in groupedByCategory" :key="category.name">
      <h2>{{ category.name }}</h2>
      <p>{{ category.description }}</p>

      <div class="pdf-grid">
        <PdfCard v-for="pdf in category.pdfs" :key="pdf.id" :pdf="pdf" />
      </div>
    </section>
  </section>
</template>

<style scoped>
section {
  padding: 16px;
}

.pdf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

h2 {
  margin: 8px 0;
  font-size: 1.1rem;
}

p {
  margin: 4px 0 12px;
  color: #666;
  font-size: 0.95rem;
}
</style>
