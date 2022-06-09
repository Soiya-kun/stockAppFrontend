<template>
  <label
    class="block text-center focus:outline-none py-4 rounded-2xl cursor-pointer flex justify-center items-center"
    :class="{ 'cursor-not-allowed': $props.disabled,
              'hover:opacity-80': !$props.disabled,
              'text-gray-100 bg-gray-400': $props.disabled,
              'text-white bg-blue-500': !$props.disabled,
    }"
  >
    <input
      ref="input"
      class="hidden"
      type="file"
      :accept="$props.accept"
      :disabled="$props.disabled"
      @input="handleInput"
    >
    {{ $props.text }}
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    text: { type: String, required: true },
    disabled: { type: Boolean, required: false, default: false },
    accept: { type: String, required: false, default: '' }
  },
  methods: {
    handleInput (e: any) {
      const fileInputted = e.target.files[0];
      this.deleteValue(); // valueは常に消す
      this.$emit('input', fileInputted);
    },
    deleteValue () {
      // <input>のvalueを消す
      const input:any = this.$refs.input;
      input.value = '';
    }
  }
});
</script>
