<template>
  <div class="view--setting">
    <AccountForm>
      <template v-slot:logo>
        <img
          class="form__logo"
          src="../assets/images/Logo_small.png"
          alt="logo"
        />
      </template>
      <template v-slot:header> 建立你的帳號 </template>
      <template v-slot:button
        ><PrimaryButtonLarge
          class="form__btn"
          @click.native.prevent.stop="register"
          >註冊
        </PrimaryButtonLarge>
      </template>
      <template v-slot:cancel>
        <router-link class="link--login" :to="{ name: 'user-login' }"
          >取消</router-link
        >
      </template>
    </AccountForm>
  </div>
</template>

<script>
import AccountForm from "@/components/AccountForm";
import PrimaryButtonLarge from "@/components/Buttons/PrimaryButtonLarge.vue";
import { mapActions } from "vuex";
import { POST_ACCOUNT } from "../store/store-types";

export default {
  name: "UserRegister",
  components: {
    AccountForm,
    PrimaryButtonLarge,
  },
  methods: {
    register() {
      this.postAccount();
    },
    ...mapActions({
      postAccount: POST_ACCOUNT,
    }),
  },
};
</script>
<style lang="scss" scoped>
.view--setting {
  height: 100%;
}
.form__logo {
  margin-bottom: 1rem;
  width: 3rem;
  height: 3rem;
}
.form__btn {
  max-width: 540px;
}
.link--login {
  color: #0099ff;
}
a {
  color: #0099ff;
}
</style>
