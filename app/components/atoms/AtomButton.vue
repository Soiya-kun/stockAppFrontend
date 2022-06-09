<template>
  <button
    :class="{
      'text-white bg-blue-500 hover:opacity-80': !$props.disabled && isPrimary,
      'bg-blue-300 border border-blue-500 hover:opacity-80': !$props.disabled && isSecondary,
      'bg-white border border-gray-900 hover:opacity-80': !$props.disabled && isBlack,
      'bg-white border border-gray-900 opacity-30 cursor-not-allowed': $props.disabled,
    }"
    class="font-bold text-sm focus:outline-none px-3 sm:px-6 py-2 rounded-2xl"
    :disabled="$props.disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    color: { type: String, required: false, default: 'primary' },
    disabled: { type: Boolean, required: false, default: false }
  },
  computed: {
    isPrimary (): boolean {
      return this.$props.color === 'primary';
    },
    isSecondary (): boolean {
      return this.$props.color === 'secondary';
    },
    isBlack (): boolean {
      return this.$props.color === 'black';
    }
  }
});
</script>
