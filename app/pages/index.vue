<template>
  <div>
    <AtomSelectBox
      v-model="selectedSc"
     item-text="text"
     item-value="value"
     :items="scForSelectBox"
    />
    <GChart
      type="ComboChart"
      :data="stocksComputed"
      :options="options"
      :createChart="
      (el, google, type) => {
        return new google.visualization[type](el)
      }
    "
    />
    <div class="relative">
      <GChart
        class="-top-6 h-36 absolute"
        type="ColumnChart"
        :data="volume"
        :options="volumeOptions"
        :createChart="
      (el, google, type) => {
        return new google.visualization[type](el)
      }
    "
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// @ts-ignore
import {GChart} from "vue-google-charts/legacy";
import AtomSelectBox from "~/components/atoms/AtomSelectBox.vue";
import {StockResponse} from "~/interface/stock";

export default Vue.extend({
  components: {
    AtomSelectBox,
    GChart
  },
  data() {
    return {
      scList: [],
      selectedSc: "0001",
      options: {
        height: 600,
        width: 600,
        chartArea: {
          left: '15%',
          width: '70%'
        },
        series: {
          0: {
            type: 'candlesticks'
          },
          1: {
            type: 'line'
          }
        }
      },
      volumeOptions: {
        height: 100,
        width: 600,
        chartArea: {
          left: '7%',
          width: '70%'
        }
      },
      stocks: [],
      data: [
        ['Date', 'High', 'Open', 'Close', 'Low', 'ma5', 'ma10'],
        ['2017-11-16', 174, 172, 171, 168, 175, 170],
        ['2017-11-17', 173, 171, 172, 170, 165, 150],
        ['2017-11-18', 173, 172, 171, 170, 168, 150],
        ['2017-11-16', 174, 172, 171, 168, 175, 170],
        ['2017-11-17', 173, 171, 172, 170, 165, 150],
        ['2017-11-18', 173, 172, 171, 170, 168, 150],
        ['2017-11-16', 174, 172, 171, 168, 175, 170],
        ['2017-11-17', 173, 171, 172, 170, 165, 150],
        ['2017-11-18', 173, 172, 171, 170, 168, 150],
        ['2017-11-16', 174, 172, 171, 168, 175, 170],
        ['2017-11-17', 173, 171, 172, 170, 165, 150],
        ['2017-11-18', 173, 172, 171, 170, 168, 150],
        ['2017-11-16', 174, 172, 171, 168, 175, 170],
        ['2017-11-17', 173, 171, 172, 170, 165, 150],
        ['2017-11-18', 173, 172, 171, 170, 168, 150],
        ['2017-11-16', 174, 172, 171, 168, 175, 170],
        ['2017-11-17', 173, 171, 172, 170, 165, 150],
        ['2017-11-18', 173, 172, 171, 170, 168, 150],
      ],
      volume: [
        ['Date', 'Volume'],
        ['2017-11-16', 1234],
        ['2017-11-17', 2345],
        ['2017-11-18', 1234],
        ['2017-11-16', 1234],
        ['2017-11-17', 2345],
        ['2017-11-18', 1234],
        ['2017-11-16', 1234],
        ['2017-11-17', 2345],
        ['2017-11-18', 1234],
        ['2017-11-16', 1234],
        ['2017-11-17', 2345],
        ['2017-11-18', 1234],
        ['2017-11-16', 1234],
        ['2017-11-17', 2345],
        ['2017-11-18', 1234],
        ['2017-11-16', 1234],
        ['2017-11-17', 2345],
        ['2017-11-18', 1234],
      ]
    }
  },
  computed: {
    scForSelectBox() {
      return this.$data.scList.map((sc: string) => {
        return { text: sc, value: sc}
      })
    },
    stocksComputed() {
      // const stocks: [any] = [['Date', 'High', 'Open', 'Close', 'Low', 'ma5', 'ma10']];
      const stocks: [any] = [['Date', 'High', 'Open', 'Close', 'Low']];
      this.$data.stocks.forEach((stock: StockResponse) => {
        console.log([stock.b_date, stock.high_price, stock.opened_price, stock.closed_price, stock.low_price]);
        stocks.push([stock.b_date, stock.high_price, stock.opened_price, stock.closed_price, stock.low_price]);
      });
      return stocks;
    }
  },
  watch: {
    async selectedSc() {
      this.$data.stocks = await this.$axios.$get(`/api/stock/list/${this.$data.selectedSc}`);
    }
  },
  async mounted() {
    this.$data.scList = await this.$axios.$get('/api/stock/sc/list');
    this.$data.stocks = await this.$axios.$get(`/api/stock/list/${this.$data.selectedSc}`);
  },
  methods: {
  }
});
</script>
