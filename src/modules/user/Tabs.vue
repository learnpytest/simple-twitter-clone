<template lang="html">
  <div>
    <ul class="tabs__header">
      <li
        v-for="(tab, index) in tabs"
        :key="tab.title"
        :class="{ tab__selected: index == selectedIndex }"
        @click.stop.prevent="selectTab(index)"
      >
        {{ tab.title }}
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedIndex: 0, // the index of the selected tab,
      tabs: [], // all of the tabs
      filterType: {},
    };
  },
  created() {
    this.tabs = this.$children;
  },
  mounted() {
    this.selectTab(0);
  },
  methods: {
    selectTab(i) {
      this.selectedIndex = i;
      // select tabs will set the filter type to decide what tweets to render

      // loop over all the tabs
      this.tabs.forEach((tab, index) => {
        tab.isActive = index === i;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./src/assets/scss/main.scss";
ul.tabs__header {
  display: block;
  list-style: none;
  border-bottom: 1px solid $gray-75;
}
li {
  font-size: 13px;
  padding: 30px 35px 15px 35px;
  font-weight: var(--fw-bold);
  color: $gray-600;
  display: inline-block;
  cursor: pointer;
}
.tab__selected {
  border-bottom: 2.5px solid $orange-100;
  color: $orange-100;
}
</style>
