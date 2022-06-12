<template>
  <div>
    <GChart
      type="ComboChart"
      :data="data"
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

export default Vue.extend({
  components: {
    GChart
  },
  data() {
    return {
      scList: [],
      options: {
        height: 400,
        width: 600,
        chartArea: {
          left: '7%',
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
  async mounted() {
    this.$data.scList = await this.$axios.$get('/api/stock/sc/list');
  },
  methods: {
  }
});
</script>
