<script setup lang="ts">
import ConverterForm from './ConverterForm.vue'

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="title">
    <h1 class="green">{{ title }}</h1>
    <ConverterForm></ConverterForm>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.title h1 {
  text-align: center;
}

@media (min-width: 1024px) {
  .title h1 {
    text-align: left;
  }
}
</style>
