<template>
  <input
    class="border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
    :value="$props.value"
    :disabled="$props.disabled"
    :placeholder="$props.placeholder"
    :type="$props.type"
    :step="$props.step"
    :min="$props.min"
    :max="$props.max"
    @focus="$emit('focus', $event.target.value)"
    @focusin="$emit('focusin', $event.target.value)"
    @input="$emit('input', $event.target.value)"
    @change="$emit('change', $event.target.value)"
    @blur="$emit('blur', $event.target.value)"
    @keyup.enter="$emit('onEnter')"
  >
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    disabled: { type: Boolean, required: false, default: false },
    value: { type: [String, Number], required: false, default: null },
    placeholder: { type: String, required: false, default: '' },
    type: { type: String, required: false, default: '' },
    step: { type: Number, required: false, default: 1 },
    min: { type: Number, required: false, default: undefined },
    max: { type: Number, required: false, default: undefined }
  }
});
</script>
