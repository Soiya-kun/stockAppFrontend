<template>
  <div class="p-4">
    <div class="flex mb-12">
      <AtomInputFileButton
        v-model="$data.csvFile"
        type="file"
        class="h-12 w-max px-6 mr-2"
        text="株価データファイル選択"
        accept="*.csv"
      />
      <AtomButton @click="postData">
        送信
      </AtomButton>
    </div>
    <div v-for="(data, i) of $data.stockDataList" :key="i">
      {{ data }}
    </div>
    <div class="flex mb-12">
      <AtomInput v-model="$data.splitSc" />
      <AtomInput v-model="$data.splitDate" type="date" />
      <AtomInput v-model="$data.splitRatio" type="number" />
      <AtomButton @click="postSplit">
        split送信
      </AtomButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AtomInputFileButton from "~/components/atoms/AtomInputFileButton.vue";
import AtomButton from "~/components/atoms/AtomButton.vue";
import AtomInput from "~/components/atoms/AtomInput.vue";

export default Vue.extend({
  components: {AtomInput, AtomButton, AtomInputFileButton},
  data() {
    return {
      csvFile: { name: '' } as File,
      reader: new FileReader(),
      stockDataList: [],
      splitSc: '',
      splitDate: '',
      splitRatio: ''
    }
  },
  watch: {
    csvFile (): void {
      this.$data.reader.readAsText(this.$data.csvFile, 'shift-jis');
    },
  },
  mounted () {
    // 奉行から出力したtxtファイルをバックエンド用のデータに整形する。
    this.$data.reader.onload = () => {
      const lines = this.$data.reader.result.split(/\r\n|\n/);
      this.$data.stockDataList = [];
      for (const line of lines) {
        const row = line.replaceAll('"', '').split(',');
        if (row[0] === 'SC') {
          continue;
        }
        const data = {
          sc: row[0],
          name: row[1],
          market: row[2],
          industry: row[3],
          b_date: `${row[4].substr(0, 4)}-${row[4].substr(4, 2)}-${row[4].substr(6, 2)}`,
          closed_price: row[5].replaceAll('-', '0'),
          opened_price: row[9].replaceAll('-', '0'),
          high_price: row[10].replaceAll('-', '0'),
          low_price: row[11].replaceAll('-', '0'),
          volume: row[12].replaceAll('-', '0'),
          transaction_price: row[13].replaceAll('-', '0'),
          market_capitalization: row[14].replaceAll('-', '0'),
          low_limit: row[15].replaceAll('-', '0'),
          high_limit: row[16].replaceAll('-', '0')
        };
        this.$data.stockDataList.push(data);
      }
    };
  },
  methods: {
    async postData (): Promise<void> {
      await this.$axios.$post('/api/stock/list', this.$data.stockDataList);
      this.$data.stockDataList = [];
    },
    async postSplit (): Promise<void> {
      await this.$axios.$post(
        '/api/stock/split',
        { sc: this.$data.splitSc, split_date: this.$data.splitDate, split_ratio: this.$data.splitRatio}
      );
    },
  }
});
</script>
