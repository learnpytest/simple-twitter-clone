<template>
  <form class="user-edit-modal" @submit.stop.prevent="handleSubmit">
    <div class="user-edit-box">
      <div class="header-btn">
        <img
          src="./../../assets/images/icon_close.svg"
          alt=""
          @click="handleShowModalClick"
        />
        <p class="header-text">編輯個人資料</p>
        <button type="submit" class="save-btn" :disabled="isProcessing">
          {{ isProcessing ? "處理中..." : "儲存" }}
        </button>
      </div>
      <div class="background-pic">
        <img :src="userCover" alt="" />

        <div class="pic-btn-control">
          <label for="cover">
            <img
              src="./../../assets/images/icon_uploadPhoto.png"
              alt=""
              id="upload-btn"
            />
          </label>
          <input
            type="file"
            id="cover"
            name="cover"
            accept="image/png, image/jpeg"
            style="width: 0"
            @change="handleCoverFileChange"
          />
          <img
            src="./../../assets/images/icon_delete.png"
            alt=""
            id="delete-btn"
            @click="deleteCover"
          />
        </div>
      </div>
      <div class="edit-profile-pic">
        <div class="profile-pic">
          <div class="profile-pic-wrapper">
            <!-- <img :src="fetchCurrentUser.avatar" alt="" class="" /> -->
            <label for="avatar">
              <img :src="userAvatar" alt="" class="userAvatar" />
              <img
                src="./../../assets/images/icon_uploadPhoto.png"
                alt=""
                class="asd"
              />
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
              style="width: 0"
              @change="handleAvatarFileChange"
            />
          </div>
        </div>
      </div>
      <div class="form__groups">
        <div class="form__group">
          <label for="name">名稱</label>
          <input
            type="text"
            id="name"
            name="name"
            v-model="userObj.name"
            maxlength="50"
          />
          <div class="limit-error">
            <!-- todo error message -->
            <span class="warning-text" v-if="userName.length >= 50"
              >名稱字數不可超過 50 字</span
            >
            <span v-if="submitEmptyField" class="warning-text"
              >內容不可空白</span
            >
            <p>{{ nameCharactersLeft }}</p>
            <!-- <span class="limiter">{{ charactersLeft() }}</span> -->
          </div>
        </div>
        <div class="form__group">
          <label for="bio">自我介紹</label>
          <input
            type="bio"
            id="bio"
            name="introduction"
            row="2"
            v-model="userIntroduction"
            maxlength="160"
          />
          <div class="limit-error">
            <!-- todo error message -->
            <span class="warning-text" v-if="userIntroduction.length >= 160"
              >自我介紹字數不可超過 160 字</span
            >
            <p>{{ introCharactersLeft }}</p>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import { mixinEmptyImage } from "../../utils/mixin";
import { mapGetters, mapActions } from "vuex";
import currentUserAPI from "@/apis/currentUserAPI";
import {
  PUT_CURRENT_USER_PROFILE,
  GET_IS_PROCESSING,
} from "../../store/store-types";
export default {
  mixins: [mixinEmptyImage],
  props: {
    initialEditModal: {
      type: Boolean,
      required: true,
    },
    // initialUserObj: {
    //   type: Object,
    //   required: true,
    // },
  },
  data() {
    return {
      userId: "",
      userName: "",
      userCover: "",
      userAvatar: "",
      userIntroduction: "",
      showEditModal: false,
      limit: -1,

      submitEmptyField: false,

      userObj: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async handleSubmit(e) {
      if (!this.userName.length) {
        this.submitEmptyField = true;
        return;
      }
      const form = e.target; // <form></form>
      const formData = new FormData(form);
      const payload = { formData, userId: this.userId };
      this.putCurrentUserProfile(payload);
      // // 測試用
      // for (let [name, value] of formData.entries()) {
      //   console.log(name + ": " + value);
      // }
      this.$emit("afterUpdateUserProfile", this.userId);
      setTimeout(() => {
        this.handleShowModalClick();
      }, 1000);
    },
    handleAvatarFileChange(e) {
      const { files } = e.target;
      if (files.length === 0) {
        // this.userAvatar = "";
        return;
      } else {
        // 產生預覽圖
        const imageURL = window.URL.createObjectURL(files[0]);
        this.userAvatar = imageURL;
      }
    },
    handleCoverFileChange(e) {
      const { files } = e.target;
      if (files.length === 0) {
        return;
      } else {
        // 產生預覽圖
        const imageURL = window.URL.createObjectURL(files[0]);
        this.userCover = imageURL;
      }
    },
    deleteCover() {
      this.userCover = "empty";
    },
    ...mapActions({
      putCurrentUserProfile: PUT_CURRENT_USER_PROFILE,
    }),
    async fetchData() {
      try {
        const res = await currentUserAPI.getCurrentUser();
        const { data, statusText } = res;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.userObj = { ...data };

        // const { id, name, cover, avatar, introduction } = this.userObj;
        // [
        //   this.userId,
        //   this.userName,
        //   this.userCover,
        //   this.userAvatar,
        //   this.userIntroduction,
        // ] = [id, name, cover, avatar, introduction];
      } catch (err) {
        console.log(err);
      }
      this.showEditModal = this.initialEditModal;
    },
    handleShowModalClick() {
      this.showEditModal = false;
      this.$emit("show-edit-modal");
    },
    resetEmpty() {
      this.submitEmptyField = false;
    },
  },
  computed: {
    ...mapGetters({
      isProcessing: GET_IS_PROCESSING,
    }),
    nameCharactersLeft() {
      let char = this.userName.length,
        limit = 50;
      return limit - char + " / " + limit;
    },
    introCharactersLeft() {
      let char = this.userIntroduction.length,
        limit = 160;
      return limit - char + " / " + limit;
    },
  },
  // watch: {
  //   initialUserObj() {
  //     this.fetchData();
  //   },
  // },
};
</script>
<style lang="scss" scoped>
@import "./src/assets/scss/main.scss";
@import "@/assets/scss/utils/_variables.scss";
.userAvatar {
  border-radius: 50%;
}
.header-text {
  position: absolute;
  left: 70px;
  font-weight: var(--fw-bold);
}
.header-btn {
  display: flex;
  flex-flow: row nowrap;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  position: relative;
  img {
    cursor: pointer;
  }
  .save-btn {
    border-radius: 25px;
    padding: 3px 12px;
    color: $white;
    background-color: $orange-100;
  }
}
.header-btn img {
  filter: invert(42%) sepia(75%) saturate(2795%) hue-rotate(2deg)
    brightness(105%) contrast(104%);
  width: 23px;
}
.user-edit-box {
  background-color: $white;
  width: 42%;
  margin: 0 auto;
  border-radius: 10px;
}
.user-edit-modal {
  background-color: rgba(28, 28, 28, 0.5);
  height: 100%;
  padding-top: 50px;
  width: 100%;
}
.background-pic img {
  max-width: auto;
  height: 170px;
  object-fit: cover;
}
.background-pic {
  position: relative;
  .pic-btn-control {
    display: flex;
    position: absolute;
    top: 50%; /* position the top  edge of the element at the middle of the parent */
    left: 50%; /* position the left edge of the element at the middle of the parent */
    transform: translate(-50%, -50%);
    img {
      width: 20px;
      height: 20px;
      line-height: 170px;
      margin-right: 30px;
    }
  }
}
.profile-pic {
  padding: 10px;
  margin-top: -90px;
  :nth-child(2) {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 50%; /* position the top  edge of the element at the middle of the parent */
    left: 50%; /* position the left edge of the element at the middle of the parent */
    transform: translate(-50%, -50%);
  }
  .profile-pic-wrapper {
    position: relative;
    width: 120px;
  }
}
.profile-pic img {
  width: 120px;
  height: 120px;
}
#profile-pic {
  border-radius: 50%;
}
.form__group {
  font-size: 1rem;
  background-color: $gray-50;
  margin: 10px;
  input {
    width: 100%;
    border: none;
    padding: 5px 5px 5px 15px;
    border-bottom: 1.5px solid $gray-600;
    @include grays(border-color, g-600);
    background-color: $gray-50;
    font-size: 1rem;
  }
  input:hover,
  input:focus {
    border-bottom: 1.5px solid $blue-800;
  }
  label {
    padding: 5px 5px 5px 15px;
    display: block;
    font-size: 13px;
    color: $gray-600;
  }
}
.limit-error {
  text-align: right;
  background-color: $white;
  color: $gray-600;
  padding: 5px;
  font-size: 13px;
  p {
    display: inline-block;
  }
  .warning-text {
    display: inline-block;
    color: $red;
    margin-right: 10px;
  }
}
.form__groups {
  padding-bottom: 2rem;
}
</style>
