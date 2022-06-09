<template>
  <BaseModal :is-open="$props.isOpen" @close="$emit('close')">
    <div class="flex flex-col">
      <AtomInput v-model="$data.username" placeholder="username" class="mb-4" />
      <AtomInput v-model="$data.password" placeholder="password" class="mb-4" type="password" />
      <AtomButton color="primary" @click="login">
        ログイン
      </AtomButton>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import Vue from 'vue';
import AtomInput from "~/components/atoms/AtomInput.vue";
import AtomButton from "~/components/atoms/AtomButton.vue";
import BaseModal from "~/components/molecules/BaseModal.vue";

export default Vue.extend({
  layout: 'default',
  components: {BaseModal, AtomButton, AtomInput},
  props: {
    isOpen: {type: Boolean, required:true}
  },
  data () {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login () {
      this.$emit('close');
      const form = new FormData();
      form.append('username', this.$data.username);
      form.append('password', this.$data.password);
      // @ts-ignore
      this.$store.$auth.loginWith('local', { data: form })
        .then((res: any) => {
          const token = res.data.access_token;
          // @ts-ignore
          this.$store.$auth.setUserToken(token, 'Bearer');
          this.$router.push('/');
        });
    }
  }
});
</script>
