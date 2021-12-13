<template>
  <div class="card">
    <div class="card__header">
      <img class="card__img card__img--poster" :src="user.cover" alt="" />
      <img class="card__img card__img--avatar" :src="user.avatar" />
    </div>
    <div class="card__txt">
      <div class="card__name">{{ user.name }}</div>
      <div class="card__account">@{{ user.account }}</div>
    </div>
    <div class="card__interaction card__interaction--feeds">
      <div class="feeds">
        <img
          class="feeds__icon"
          src="@/assets/images/icon_reply.png"
          alt=""
        /><span class="feeds__count">{{ user.TweetsCount }}</span>
      </div>
      <div class="feeds">
        <img
          class="feeds__icon"
          src="@/assets/images/icon_like.png"
          alt=""
        /><span class="feeds__count">{{ user.LikesCount }}</span>
      </div>
    </div>
    <div class="card__interaction card__interaction--follows">
      <div class="replies">
        {{ user.FollowingsCount }} <span class="replies--styled">個跟隨中</span>
      </div>
      <div class="likes">
        {{ user.FollowersCount }} <span class="replies--styled">位跟隨者</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminUserCard",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/mixins/_colors.scss";
@import "@/assets/scss/utils/_variables.scss";

// Admin user card sigle style only
.card {
  background-color: #f6f7f8;
  border-radius: 10px 10px 10px 10px;
  min-width: 245px;
  min-height: 140px;
  overflow: hidden;
  width: 23.5%;
  &__header {
    position: relative;
    width: 100%;
  }
  &__img {
    width: 100%;
    height: 100%;
    vertical-align: middle;
    object-fit: cover;
  }
  &__img--avatar {
    position: absolute;
    right: 50%;
    bottom: -28%;
    transform: translateX(50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid var(--g-0);
    overflow: hidden;
  }
  &__img--poster {
    min-height: 140px;
  }

  &__txt {
    margin-top: 18%;
    margin-bottom: 1rem;
    flex-direction: column;
    line-height: 1.5rem;
    font-size: 1rem;
    font-weight: var(--fw-normal);
  }
  &__name {
    font-weight: var(--fw-bolder);
    @include grays(color, g-900);
  }
  &__account {
    @include grays(color, g-600);
  }
  &__txt,
  &__interaction {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }
  &__interaction {
    gap: 1rem;
    .feeds {
      display: flex;
      gap: 0.3rem;
      align-items: center;
      &__icon {
        width: 1.2rem;
      }
      &__count {
        line-height: 0.9rem;
        height: 0.9rem;
        @include grays(color, g-900);
      }
    }
  }
  &__interaction--follows {
    gap: 0.3rem;
    font-size: 0.9rem;
    @include grays(color, black);
    .replies--styled {
      font-weight: var(--fw-thin);
      @include grays(color, g-600);
    }
  }

  // 當管理者滑鼠與使用者卡片互動，卡片樣式有所改變
  &:hover {
    outline: 2px solid $yellow;
    cursor: pointer;
  }
}
</style>
