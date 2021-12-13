<template>
  <div class="addtweet-wrapper">
    <div class="header">首頁</div>
    <div class="text-box">
      <div class="user-info">
        <img class="user-pic" :src="currentUser.avatar | emptyImage" alt="" />
      </div>
      <div class="text-area" @click="handleShowModalClick">
        <textarea
          class="form-control"
          rows="3"
          placeholder="有什麽新鮮事"
          v-model="text"
        />
      </div>
    </div>
    <div class="tweet-btn">
      <button>推文</button>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
// import { GET_CURRENT_USER } from "../../store/store-types";
import { mixinEmptyImage } from "../../utils/mixin";
import currentUserAPI from "@/apis/currentUserAPI";
export default {
  mixins: [mixinEmptyImage],
  props: {
    initialShowModal: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showModal: "",
      text: "",
      currentUser: {},
    };
  },
  created() {
    this.fetchData();
    this.getCurrentUser();
  },
  methods: {
    fetchData() {
      this.showModal = this.initialShowModal;
    },
    handleShowModalClick() {
      this.showModal = false;
      this.$emit("show-modal");
    },
    async getCurrentUser() {
      try {
        const res = await currentUserAPI.getCurrentUser();
        const { data, statusText } = res;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.currentUser = data;
      } catch (err) {
        console.log(err);
      }
    },
  },
  // computed: {
  //   ...mapGetters({
  //     getCurrentUser: GET_CURRENT_USER,
  //   }),
  // },
};
</script>

<style lang="scss" scoped>
@import "./../../assets/scss/main.scss";
.addtweet-wrapper {
  min-height: 190px;
}
.header {
  font-weight: var(--fw-bold);
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid $gray-75;
  padding-left: 15px;
}
.text-box {
  display: flex;
  flex-flow: row nowrap;
  padding: 10px;
}

.user-info {
  color: $gray-700;
  width: 10%;
  .user-pic {
    margin-right: 10px;
    max-width: 50px;
    max-height: 50px;
    border-radius: 50px;
  }
}

.text-area {
  width: 90%;
  textarea {
    border: 0px;
    resize: none;
    width: 100%;
    margin-left: 10px;
    margin-top: 10px;
    font-family: Noto Sans;
  }
}

.tweet-btn {
  text-align: right;
  padding-right: 10px;
  border-bottom: 10px solid #e6ecf0;
  padding-bottom: 10px;
  button {
    background-color: $orange-100;
    // font-weight: var(--fw-normal);
    color: $white;
    font-size: 16px;
    width: 65px;
    height: 36px;
    border-radius: 50px;
  }
}
</style>
