<template>
  <div
    v-if="$props.isOpen"
    class="fixed inset-0 h-full bg-black bg-opacity-20 flex items-center justify-center z-10"
  >
    <div class="bg-white rounded-2xl p-4 z-10">
      <slot />
    </div>
    <div
      class="fixed h-screen w-screen top-0 left-0 z-0"
      @click="$emit('close')"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    isOpen: { type: Boolean, default: false }
  }
});
</script>
