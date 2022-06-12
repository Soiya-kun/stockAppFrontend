<template>
  <div>
    <AtomSelectBox
      v-model="selectedSc"
     item-text="text"
     item-value="value"
     :items="scForSelectBox"
    />
    何日前までか
    <AtomInput
      v-model="dayBeforeCount"
      :max="0"
      type="number"
      class="w-48"
    />
    何日分か
    <AtomInput
      v-model="dayCount"
      :min="1"
      type="number"
      class="w-48"
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
        :data="volumeComputed"
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
import AtomInput from "~/components/atoms/AtomInput.vue";

export default Vue.extend({
  components: {
    AtomInput,
    AtomSelectBox,
    GChart
  },
  data() {
    return {
      dayCount: 30,
      dayBeforeCount: 0,
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
          left: '15%',
          width: '70%'
        }
      },
      stocks: [],
    }
  },
  computed: {
    scForSelectBox() {
      return this.$data.scList.map((sc: string) => {
        return { text: sc, value: sc}
      })
    },
    stocksComputed() {
      if (this.$data.dayCount < 0) {
        this.$data.dayCount = 1;
      }
      if (this.$data.dayBeforeCount > 1) {
        this.$data.dayBeforeCount = 0;
      }
      let stocks: any[] = [];
      this.$data.stocks.forEach((stock: StockResponse, index: number, array: StockResponse[]) => {
        let ma5: number|null = null;
        if (index >= 5) {
          ma5 = array.slice(index-4, index+1).map((stock: StockResponse) => {
            return stock.closed_price;
          }).reduce((sum: number, closed_price:number ) => {
            return sum + closed_price;
          }) / 5
        }
        let ma20: number|null = null;
        if (index >= 20) {
          ma20 = array.slice(index-19, index+1).map((stock: StockResponse) => {
            return stock.closed_price;
          }).reduce((sum: number, closed_price:number ) => {
            return sum + closed_price;
          }) / 20
        }
        stocks.push([
          stock.b_date,
          stock.high_price,
          stock.opened_price,
          stock.closed_price,
          stock.low_price,
          ma5,
          ma20
        ]);
      });
      stocks = stocks.slice(
        this.$data.stocks.length - this.$data.dayCount - 1 + Number(this.$data.dayBeforeCount),
        this.$data.stocks.length - 1 + Number(this.$data.dayBeforeCount)
      );
      stocks.unshift(['Date', 'High', 'Open', 'Close', 'Low', 'ma5', 'ma20']);
      return stocks;
    },
    volumeComputed() {
      let volumes: any[] = [];
      this.$data.stocks.forEach((stock: StockResponse) => {
        volumes.push([
          stock.b_date,
          stock.volume
        ]);
      });
      volumes = volumes.slice(
        this.$data.stocks.length - this.$data.dayCount - 1 + Number(this.$data.dayBeforeCount),
        this.$data.stocks.length - 1 + Number(this.$data.dayBeforeCount)
      );
      volumes.unshift(['Date', 'Volume']);
      return volumes;
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
