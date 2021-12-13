<template>
  <button class="button button--small">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "PrimaryButtonSmall",
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/_variables.scss";
.button--small {
  width: fit-content;
  padding: 0.7rem 2.5rem;
  font-family: var(--ff-primary);
}
.button {
  border: 1px solid var(--primary);
  line-height: 1.6rem;
  background: var(--primary);
  height: fit-content;
  font-size: 1.1rem;
  border-radius: 100px;
  font-weight: 700;
  color: white;
  &:hover {
    cursor: pointer;
    background: var(--button-hover-color);
  }
  &:focus {
    outline: 2px solid var(--button-focus-outline-color);
  }
}
</style>
