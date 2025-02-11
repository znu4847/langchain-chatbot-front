<script setup>
const props = defineProps({
  loading: Boolean,
})
</script>
<template>
  <div
    v-if="props.loading"
    class="progress-overlay"
  >
    <v-progress-circular
      color="grey"
      indeterminate
      size="64"
    ></v-progress-circular>
  </div>
</template>

<style scoped>
.progress-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999; /* Ensure it is on the top layer */
}
</style>
