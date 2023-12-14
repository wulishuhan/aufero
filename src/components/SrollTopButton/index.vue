<template>
  <div>
    <div @click="srollIntoTop" class="to-top">
      <i class="ortur-icon-top"></i>
    </div>
  </div>
</template>
<script>
export default {
  // 该组件是跳转到对应id的标签，传入to字符串，如 '#test' 代表跳转到id为test的html标签处
  props: {
    to: {
      type: String,
      default: ".app-header-wrapper",
    },
  },
  methods: {
    srollIntoTop() {
      document.querySelector(this.to).scrollIntoView(true);
    },
  },
};
</script>
<style scoped>
.to-top {
  width: 78px;
  height: 48px;
  background: #ffffff;
  border-radius: 8px;
  position: fixed;
  bottom: 30px;
  right: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
i {
  font-size: 17px;
}
</style>
