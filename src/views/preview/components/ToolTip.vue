<template>
  <div style="margin-left: 142px; margin-top: 50px">
    <div class="content" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
      <slot name="content"></slot>
    </div>
    <div v-show="show" class="tip" :style="tipStyle">
      <slot name="tip"></slot>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      pos: {
        x: 0,
        y: 0,
      },
      tipStyle: {
        position: "absolute",
        left: 0,
        right: 0,
      },
      release: true,
    };
  },
  methods: {
    mouseEnter(e) {
      console.log("e", e);
      this.show = true;
      this.tipStyle.left = e.x + "px";
      this.tipStyle.right = e.y + "px";
      this.release = true;
    },
    mouseLeave() {
      //   this.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  background-color: #303133;
  color: #fff;
  padding: 10px;
}
.tip {
  background: #fff;
  border: 1px solid #303133;
  font-size: 12px;
  min-width: 10px;
  word-wrap: break-word;
  border-radius: 4px;
  padding: 10px;
  display: inline;
}
</style>
