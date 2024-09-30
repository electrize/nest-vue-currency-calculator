<script setup lang="ts">
const model = defineModel()

interface Props {
  onChange: () => void
  options: []
  optionKey: string
  optionValue: string
  disabled?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <select v-model="model" :disabled="props.disabled" @change="onChange">
    <option v-for="option in props.options" :key="option[optionKey]">
      {{ option[optionValue] }}
    </option>
  </select>
</template>

<style scoped>
select {
  appearance: none;
  background: transparent;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 5px;
}
</style>
