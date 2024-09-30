<script setup lang="ts">
interface Props {
  name: string
}
const props = defineProps<Props>()
</script>

<template>
  <div class="form-group">
    <label>
      <span class="label-text">{{ props.name }}</span>
      <slot></slot>
    </label>
  </div>
</template>

<style scoped></style>
