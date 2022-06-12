<template>
  <select
    ref="input"
    class="border border-gray-200 bg-white rounded py-2 px-2 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
    :value="$props.value"
    :disabled="$props.disabled"
    @input="$emit('input', $event.target.value)"
    @change="$emit('change', $event.target.value)"
    @blur="$emit('blur', $event.target.value)"
    @keyup.enter="$emit('onEnter', $event.target.value)"
  >
    <option v-for="item in itemsComputed" :key="item[$props.itemValue]" :value="item[$props.itemValue]">
      {{ item[$props.itemText] }}
    </option>
  </select>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    disabled: { type: Boolean, required: false, default: false },
    value: { type: [String, Number], required: false, default: null },
    items: { type: Array, required: true },
    itemText: { type: String, required: true },
    itemValue: { type: String, required: true }
  },
  computed: {
    itemsComputed (): Array<Object> {
      return this.$props.items;
    }
  },
  watch: {
    items (): void {
      if (this.$props.items.length !== 0) {
        this.$emit('input', this.$props.items[0][this.$props.itemValue]);
      }
    }
  },
  methods: {
    focus (): void {
      const input: any = this.$refs.input;
      input.focus();
    }
  }
});
</script>
