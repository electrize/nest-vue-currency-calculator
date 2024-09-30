<script setup lang="ts">
import ConverterForm from './ConverterForm.vue'
interface Props {
  title: string
}
const props = defineProps<Props>()
</script>

<template>
  <div>
    <h1 class="green title">{{ props.title }}</h1>
    <div class="form-wrapper">
      <ConverterForm></ConverterForm>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-weight: 500;
  font-size: 4rem;
  line-height: 1;
  text-align: center;
  margin-bottom: 2rem;
}
@media (min-width: 1024px) {
  .title {
    text-align: left;
  }
}

.form-wrapper {
  background-color: rgb(52 73 94);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
  color: white;
}
</style>
