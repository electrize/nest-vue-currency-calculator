<script setup lang="ts">
interface Props {
  class?: string
  type?: string
}
const props = withDefaults(defineProps<Props>(), {
  type: 'plain',
  class: ''
})
</script>

<template>
  <div class="message" :class="props.type + ' ' + props.class" v-if="$slots">
    <slot></slot>
  </div>
</template>

<style scoped>
.message {
  margin-top: 2rem;
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
}
.plain {
  color: inherit;
}
.error {
  color: #f88585;
}
.success {
  color: #8bf885;
}
</style>
