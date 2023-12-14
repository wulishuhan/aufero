<template>
  <div class="nav-item">
    <span>
      {{ $t(`message.${name}`) }}
    </span>
    <div v-show="num !== 0" class="nav-item-tip">
      {{ num > 99 ? "..." : num }}
    </div>
  </div>
</template>
<script>
export default {
  name: "NavItem",
  props: {
    name: {
      type: String,
      default: "All",
    },
    num: {
      type: Number,
      default: 0,
    },
  },
};
</script>
<style lang="scss" scoped>
.nav-item-tip {
  border-radius: 50%;
  background: #ff6161;
  width: 20px;
  height: 20px;
  color: #fff;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
}
.nav-item {
  padding: 0 24px;
  font-size: 16px;
  line-height: 48px;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-top: 12px;
}
.nav-item:hover {
  background: #8ab5ef;
  color: #fff !important;
}
</style>
