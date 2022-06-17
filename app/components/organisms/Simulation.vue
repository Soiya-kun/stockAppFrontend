<template>
  <div>
    <div>
      <span>寄付</span>
      <input v-model="$data.isApproaching" type="checkbox" />
    </div>
    <div class="my-1">
      <span class="mr-2">現金</span>
      <AtomInput v-model="$data.cash" type="number" />
    </div>
    <div class="flex items-center my-1">
      <span class="mr-2">株数</span>
      <div class="flex items-center">
        <AtomInput v-model="$data.volume" type="number" class="mr-2" />
        <div>×100株</div>
      </div>
    </div>
    <div>
      <div>
        買い購入金額 {{ $data.buyPosition.totalPrice }}円
      </div>
      <div>
        買い評価金額 {{ buyValuation }}円
      </div>
      <div>
        買いポジション株数 {{ $data.buyPosition.volume }}単元×100株
      </div>
      <AtomButton @click="buy">
        買い
      </AtomButton>
      <AtomButton @click="settleBuying">
        買い決済
      </AtomButton>
      <AtomButton>
        空売り
      </AtomButton>
      <AtomButton>
        売り決済
      </AtomButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AtomInput from "~/components/atoms/AtomInput.vue";
import AtomButton from "~/components/atoms/AtomButton.vue";

interface Position { totalPrice: number, volume: number}

export default Vue.extend({
  components: {AtomButton, AtomInput},
  props: {
    stock: {type: Array, required: true}
  },
  data() {
    return {
      isApproaching: false,
      cash: 10000000,
      volume: 1,
      buyPosition: {totalPrice: 0, volume: 0} as Position
    }
  },
  computed: {
    buyValuation(): number {
      return this.$data.buyPosition.volume * this.$props.stock[3] * 100;
    }
  },
  methods: {
    buy() {
      const price = this.$data.isApproaching ? this.$props.stock[2] : this.$props.stock[3];
      if (price * this.$data.volume * 100 > this.$data.cash) {
        return;
      }
      this.$data.buyPosition.totalPrice += price * this.$data.volume * 100;
      this.$data.buyPosition.volume += this.$data.volume;
      this.$data.cash -= price * this.$data.volume * 100;
    },
    settleBuying() {
      const price = this.$data.isApproaching ? this.$props.stock[2] : this.$props.stock[3];
      this.$data.cash += price * this.buyPosition.volume * 100;
      this.$data.buyPosition.totalPrice = 0;
      this.buyPosition.volume = 0;
    }
  }
});
</script>
