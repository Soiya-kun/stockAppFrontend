<template>
  <div class="lg:flex flex-col lg:flex-row h-screen">
    <div class="lg:flex flex-col lg:flex-row lg:min-h-screen lg:w-max w-full">
      <div class="flex flex-col w-full lg:w-64 text-gray-700 bg-gray-200 dark-mode:text-gray-200 dark-mode:bg-gray-800 flex-shrink-0">
        <div class="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between">
          <NuxtLink to="/" class="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg">
            Stock
          </NuxtLink>
          <button class="rounded-lg lg:hidden rounded-lg focus:outline-none focus:shadow-outline" @click="$data.isNavOpened = !$data.isNavOpened">
            <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
              <path v-show="!$data.isNavOpened" fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd" />
              <path v-show="$data.isNavOpened" fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <nav :class="{'block': $data.isNavOpened, 'hidden': !$data.isNavOpened}" class="flex-grow lg:block px-4 pb-4 lg:pb-0 lg:overflow-y-auto bg-gray-100">
          <div
            class="flex justify-between items-center block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline cursor-pointer items-center"
          >
            <div @click="$data.isLoginOpened=true">
              <div class="flex justify-between items-center block px-8 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline cursor-pointer">
                login
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <LoginModal :is-open="$data.isLoginOpened" @close="$data.isLoginOpened=false" />
    <div class="w-full overflow-y-auto h-content">
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LoginModal from "~/components/organisms/LoginModal.vue";

export default Vue.extend({
  components: {LoginModal},
  data () {
    return {
      isNavOpened: false,
      isLoginOpened: false
    };
  },
  methods: {
    logout () {
      // @ts-ignore
      this.$store.$auth.logout();
    },
  }
});
</script>

<style>
/* ios用に必要。これが無いとなんかスクロールできなくなる */
body {
  overflow: hidden;
}
.h-content {
  height: calc(100% - 60px);
;
}
</style>
