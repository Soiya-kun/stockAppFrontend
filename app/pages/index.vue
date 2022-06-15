<template>
  <div>
    <div class="flex w-full">
      <div class="p-4">
        <AtomSelectBox
          v-model="selectedSc"
          item-text="text"
          item-value="value"
          :items="scForSelectBox"
        />
        <div class="my-1">
          <span>
          何日前までか
          </span>
          <AtomInput
            v-model="dayBeforeCount"
            :max="0"
            type="number"
            class="w-24"
          />
        </div>
        <div class="my-1">
          <span class="mr-2">
            何日分か
          </span>
          <AtomInput
            v-model="dayCount"
            :min="1"
            type="number"
            class="w-24 mr-4"
          />
          <span class="mr-2">
            何週分か
          </span>
          <AtomInput
            v-model="weekCount"
            :min="1"
            type="number"
            class="w-24"
          />
        </div>
        <Simulation ref="simu" :stock="stocksComputed[stocksComputed.length-1]" />
      </div>
      <div>
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
        <GChart
          class="h-36"
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
      <div>
        <GChart
          type="ComboChart"
          :data="stocksComputedWeek"
          :options="options"
          :createChart="
          (el, google, type) => {
            return new google.visualization[type](el)
          }
        "
        />
        <GChart
          class="h-36"
          type="ColumnChart"
          :data="volumeComputedWeek"
          :options="volumeOptions"
          :createChart="
          (el, google, type) => {
            return new google.visualization[type](el)
          }
        "
        />
      </div>
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
import Simulation from "~/components/organisms/Simulation.vue";

export default Vue.extend({
  components: {
    Simulation,
    AtomInput,
    AtomSelectBox,
    GChart
  },
  data() {
    return {
      dayCount: 45,
      dayBeforeCount: -350,
      weekCount: 48,
      scList: [],
      selectedSc: "0001",
      options: {
        height: 600,
        width: 750,
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
        width: 750,
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
        let ma60: number|null = null;
        if (index >= 60) {
          ma60 = array.slice(index-59, index+1).map((stock: StockResponse) => {
            return stock.closed_price;
          }).reduce((sum: number, closed_price:number ) => {
            return sum + closed_price;
          }) / 60
        }
        stocks.push([
          stock.b_date,
          stock.high_price,
          stock.opened_price,
          stock.closed_price,
          stock.low_price,
          ma5,
          ma20,
          ma60
        ]);
      });
      stocks = stocks.slice(
        this.$data.stocks.length - Number(this.$data.dayCount) + Number(this.$data.dayBeforeCount),
        this.$data.stocks.length + Number(this.$data.dayBeforeCount)
      );
      stocks.unshift(['Date', 'High', 'Open', 'Close', 'Low', 'ma5', 'ma20', 'ma60']);
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
        this.$data.stocks.length - Number(this.$data.dayCount) + Number(this.$data.dayBeforeCount),
        this.$data.stocks.length + Number(this.$data.dayBeforeCount)
      );
      volumes.unshift(['Date', 'Volume']);
      return volumes;
    },
    stocksComputedWeek() {
      if (this.$data.stocks.length === 0) {
        return '';
      }
      let stocks: any[] = [];
      let highPrice = 0;
      let openedPrice = 0;
      let closedPrice = 0;
      let lowPrice = 99999999999;
      let lastStock: {closed_price: number} = {closed_price: 0};
      let firstDateOfMonday = new Date(this.$data.stocks[0].b_date);
      firstDateOfMonday.setDate(firstDateOfMonday.getDate() + 1 - firstDateOfMonday.getDay());
      const originalStocks = this.$data.stocks.slice(
        0, this.$data.stocks.length + Number(this.$data.dayBeforeCount)
      );
      for (const stock of originalStocks) {
        const thisDate = new Date(stock.b_date);
        let diffMilliSec = thisDate.getTime() - firstDateOfMonday.getTime();
        if (diffMilliSec / 1000 / 60 / 60 / 24 >= 5) {
          stocks.push([
            `${firstDateOfMonday.getFullYear()}-${firstDateOfMonday.getMonth()+1}-${firstDateOfMonday.getDate()}`,
            highPrice,
            openedPrice,
            lastStock.closed_price,
            lowPrice
          ]);
          firstDateOfMonday.setDate(firstDateOfMonday.getDate() + 7);
          highPrice = 0;
          openedPrice = 0;
          closedPrice = 0;
          lowPrice = 99999999999;
        }
        if (stock.high_price > highPrice) {
          highPrice = stock.high_price;
        }
        if (stock.low_price < lowPrice) {
          lowPrice = stock.low_price;
        }
        if (openedPrice === 0) {
          openedPrice = stock.opened_price;
        }
        lastStock = stock;
      }
      stocks.push([
        `${firstDateOfMonday.getFullYear()}-${firstDateOfMonday.getMonth() + 1}-${firstDateOfMonday.getDate()}`,
        highPrice,
        openedPrice,
        this.$data.stocks[this.$data.stocks.length - 1].closed_price,
        lowPrice
      ]);
      stocks = stocks.map((data: [], index: number, array: any[]) => {
        let ma13: number|null = null;
        if (index >= 13) {
          ma13 = array.slice(index-12, index+1).map((data_: any) => {
            return data_[3];
          }).reduce((sum: number, closed_price:number ) => {
            return sum + closed_price;
          }) / 13
        }
        // @ts-ignore
        data.push(ma13);
        return data;
      })
      stocks = stocks.map((data: [], index: number, array: any[]) => {
        let ma26: number|null = null;
        if (index >= 26) {
          ma26 = array.slice(index-25, index+1).map((data_: any) => {
            return data_[3];
          }).reduce((sum: number, closed_price:number ) => {
            return sum + closed_price;
          }) / 26
        }
        // @ts-ignore
        data.push(ma26);
        return data;
      })
      stocks = stocks.slice(
        stocks.length - Number(this.$data.weekCount),
        stocks.length - 1
      );
      stocks.unshift(['Date', 'High', 'Open', 'Close', 'Low', 'ma13', 'ma26']);
      return stocks;
    },
    volumeComputedWeek() {
      if (this.$data.stocks.length === 0) {
        return '';
      }
      let volumes: any[] = [];
      let volume = 0;
      let firstDateOfMonday = new Date(this.$data.stocks[0].b_date);
      firstDateOfMonday.setDate(firstDateOfMonday.getDate() + 1 - firstDateOfMonday.getDay());
      const originalStocks = this.$data.stocks.slice(
        0, this.$data.stocks.length + Number(this.$data.dayBeforeCount)
      );
      for (const stock of originalStocks) {
        const thisDate = new Date(stock.b_date);
        let diffMilliSec = thisDate.getTime() - firstDateOfMonday.getTime();
        if (diffMilliSec / 1000 / 60 / 60 / 24 >= 5) {
          volumes.push([
            `${firstDateOfMonday.getFullYear()}-${firstDateOfMonday.getMonth()+1}-${firstDateOfMonday.getDate()}`,
            volume
          ]);
          firstDateOfMonday.setDate(firstDateOfMonday.getDate() + 7);
          volume = 0;
        }
        volume += stock.volume;
      }
      volumes.push([
        `${firstDateOfMonday.getFullYear()}-${firstDateOfMonday.getMonth() + 1}-${firstDateOfMonday.getDate()}`,
        volume
      ]);
      volumes = volumes.slice(
        volumes.length - Number(this.$data.weekCount),
        volumes.length - 1
      );
      volumes.unshift(['Date', 'Volume']);
      return volumes;
    },
  },
  watch: {
    async selectedSc() {
      this.$data.stocks = await this.$axios.$get(`/api/stock/list/${this.$data.selectedSc}`);
    },
    dayBeforeCount(ov, nv) {
      if (nv >= 0) {
        this.$data.dayBeforeCount = -150;
      }
    }
  },
  beforeDestroy() {
    // @ts-ignore
    document.removeEventListener('keydown', this.onKeyDown)
  },
  async mounted() {
    // @ts-ignore
    document.addEventListener('keydown', this.onKeyDown)
    this.$data.scList = await this.$axios.$get('/api/stock/sc/list');
    this.$data.stocks = await this.$axios.$get(`/api/stock/list/${this.$data.selectedSc}`);
  },
  methods: {
    onKeyDown(event: {key: string}) {
      if (event.key === 'b') {
        // @ts-ignore
        this.$refs.simu.buy();
      }
      if (event.key === 'v') {
        // @ts-ignore
        this.$refs.simu.settleBuying();
      }
      if (event.key === 'ArrowRight') {
        this.$data.dayBeforeCount = Number(this.$data.dayBeforeCount) + 1;
      }
      if (event.key === 'ArrowLeft') {
        this.$data.dayBeforeCount = Number(this.$data.dayBeforeCount) - 1;
      }
      if (event.key === 'ArrowUp') {
        // @ts-ignore
        this.$refs.simu.volume = Number(this.$refs.simu.volume) + 1;
      }
      if (event.key === 'ArrowDown') {
        // @ts-ignore
        this.$refs.simu.volume = Number(this.$refs.simu.volume) - 1;
      }
    }
  }
});
</script>
