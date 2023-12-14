<template>
  <div class="wrapper-container">
    <!-- overflow: hidden：清除子元素相对父元素的超界溢出 -->
    <div
      style="overflow: hidden"
      :style="{ height: showMore ? 'auto' : showHeight + 'px' }"
    >
      <div ref="content">
        <!-- eslint-disable  -->
        <slot>
          <!-- 当外界 <show-more> 标签中有元素时，使用 <show-more> 标签中的元素进行渲染，否则使用下面这个 div 进行渲染 -->
          <div v-html="content"></div>
        </slot>
      </div>
    </div>
    <div
      class="control"
      :class="[{ 'show-more': showMore }, !showMore ? 'control-mask' : '']"
      v-show="isLongContent"
    >
      <el-button class="button-show-more" type="text" @click="toggleShowMore">
        {{ showMore ? $t("ShowMore.View less") : $t("ShowMore.View all") }}
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showHeight: {
      type: Number,
      required: true,
      default: 200,
    },
    content: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showMore: false,
      isLongContent: false,
    };
  },
  created() {
    this.calculateHeight();
  },
  watch: {
    // 每当内容变化时都重新计算一次高度
    content() {
      this.calculateHeight();
    },
  },
  methods: {
    refresh() {
      this.calculateHeight();
    },
    calculateHeight() {
      // $nextTick()，等待内容获取完毕再计算高度，异步处理
      this.$nextTick().then(() => {
        let contentHeight = this.$refs.content.clientHeight;
        if (contentHeight > this.showHeight) {
          this.isLongContent = true;
        } else {
          this.isLongContent = false;
        }
      });
    },
    toggleShowMore() {
      this.showMore = !this.showMore;
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper-container {
  position: relative;
  padding-bottom: 40px;
  white-space: pre-wrap;
}
.control {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-top: 40px;
}
.control-mask {
  background-image: linear-gradient(
    -180deg,
    rgba(255, 255, 255, 0) 0%,
    #f0f3fa 70%
  );
}
.show-more {
  padding-top: 0;
  background: none;
  width: 20px;
}
.button-show-more {
  color: #1e78f0;
  font-size: 16px;
}
</style>
