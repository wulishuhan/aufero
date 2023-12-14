<template>
  <div>
    <div id="app">
      <swiper ref="swiper" :options="swiperOptions">
        <swiper-slide v-for="(item, index) in ArrList" :key="'swiper' + index">
          <div class="swiperImg">
            <img class="swiper-slide__img" :src="item" alt="" />
          </div>
        </swiper-slide>
        <div
          class="swiper-button-prev"
          @click="buttonPrev"
          slot="button-prev"
        ></div>
        <div
          class="swiper-button-next"
          @click="buttonNext"
          slot="button-next"
        ></div>
      </swiper>
      <div @click="openComment" class="showInfo">
        <i class="el-icon-arrow-left"></i>
        <i class="ortur-icon-message"></i>
      </div>
      <div class="swiper gallery-thumbs">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(item, index) in ArrList"
            :key="'thumbs' + index"
            @click="change(index)"
          >
            <div class="swiperImg2">
              <img
                class="swiper-slide__img2"
                :class="number == index ? 'cellActive' : ''"
                :src="item"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next" id="myNext"></div>
      </div>
    </div>
    <el-dialog
      :visible.sync="isCollapse"
      :modal="false"
      :before-close="handleClose"
    >
      <div style="height: 638px; width: 100%; overflow-y: scroll">
        <MakesCommentWidget
          :make="urlList[index]"
          :makesInfo="makesInfo"
          @closeAll="closeAll"
        ></MakesCommentWidget>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { on, off } from "element-ui/src/utils/dom";
import { rafThrottle, isFirefox } from "element-ui/src/utils/util";
import MakesCommentWidget from "@/components/Comment/MakesCommentWidget.vue";
const Mode = {
  CONTAIN: {
    name: "contain",
    icon: "el-icon-full-screen",
  },
  ORIGINAL: {
    name: "original",
    icon: "el-icon-c-scale-to-original",
  },
};

const mousewheelEventName = isFirefox() ? "DOMMouseScroll" : "mousewheel";
/* eslint-disable */
export default {
  name: "ImageViwer",
  components: { MakesCommentWidget },
  props: {
    makesInfo: {
      type: Object,
      default: () => {
        return {};
      },
      required: true,
    },
    urlList: {
      type: Array,
      default: () => [],
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
    onSwitch: {
      type: Function,
      default: () => {},
    },
    onClose: {
      type: Function,
      default: () => {},
    },
    initialIndex: {
      type: Number,
      default: 0,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    isMake: {
      type: Boolean,
      default: false,
    },
    isVertical: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      number: 0,
      ArrList: [],
      index: this.initialIndex,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      },
      isCollapse: false,
      showMake: false,
      swiperOptions: {
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        thumbs: {
          swiper: {
            el: ".gallery-thumbs",
            slidesPerView: 6,
            slidesPerGroup: 6, //缩略图的切图张数
            spaceBetween: 30,
            slideToClickedSlide: true,
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          },
          autoScrollOffset: true,
        },
      },
    };
  },
  mounted() {},
  computed: {
    currentImg() {
      this.ArrList = this.urlList[this.index].image;
      return this.urlList[this.index]?.url;
    },
  },
  watch: {
    index: {
      handler: function (val) {
        this.reset();
        this.onSwitch(val);
      },
    },
    currentImg(val) {
      this.$nextTick((_) => {
        const $img = this.$refs.img[0];
        if (!$img.complete) {
          this.loading = true;
        }
      });
    },
  },
  methods: {
    buttonNext() {
      this.number = this.number + 1;
      if (this.number == 6) {
        document.getElementById("myNext").click();
      }
      // for (let i = 1; i < this.ArrList.length / 6; i++) {
      //   const j = 6 * i;
      //   console.log(j, 197);
      //   if (this.number == j) {
      //     document.getElementById("myNext").click();
      //   }
      // }
    },
    buttonPrev() {
      this.number = this.number - 1;
    },
    change(index) {
      this.number = index;
    },
    hide() {
      this.deviceSupportUninstall();
      this.onClose();
    },
    deviceSupportInstall() {
      this._keyDownHandler = (e) => {
        e.stopPropagation();
        const keyCode = e.keyCode;
        switch (keyCode) {
          // ESC
          case 27:
            this.hide();
            break;
          // SPACE
          case 32:
            this.toggleMode();
            break;
          // LEFT_ARROW
          case 37:
            this.prev();
            break;
          // UP_ARROW
          case 38:
            this.handleActions("zoomIn");
            break;
          // RIGHT_ARROW
          case 39:
            this.next();
            break;
          // DOWN_ARROW
          case 40:
            this.handleActions("zoomOut");
            break;
        }
      };
      this._mouseWheelHandler = rafThrottle((e) => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (delta > 0) {
          this.handleActions("zoomIn", {
            zoomRate: 0.015,
            enableTransition: false,
          });
        } else {
          this.handleActions("zoomOut", {
            zoomRate: 0.015,
            enableTransition: false,
          });
        }
      });
      on(document, "keydown", this._keyDownHandler);
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    deviceSupportUninstall() {
      off(document, "keydown", this._keyDownHandler);
      off(document, mousewheelEventName, this._mouseWheelHandler);
      this._keyDownHandler = null;
      this._mouseWheelHandler = null;
    },
    handleImgLoad(e) {
      this.loading = false;
    },
    handleImgError(e) {
      this.loading = false;
      e.target.alt = "加载失败";
    },
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return;

      const { offsetX, offsetY } = this.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      this._dragHandler = rafThrottle((ev) => {
        this.transform.offsetX = offsetX + ev.pageX - startX;
        this.transform.offsetY = offsetY + ev.pageY - startY;
      });
      on(document, "mousemove", this._dragHandler);
      on(document, "mouseup", (ev) => {
        off(document, "mousemove", this._dragHandler);
      });

      e.preventDefault();
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      };
    },
    toggleMode() {
      if (this.loading) return;
      const modeNames = Object.keys(Mode);
      const modeValues = Object.values(Mode);
      const index = modeValues.indexOf(this.mode);
      const nextIndex = (index + 1) % modeNames.length;
      this.mode = Mode[modeNames[nextIndex]];
      this.reset();
    },
    handleActions(action, options = {}) {
      if (this.loading) return;
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options,
      };
      const { transform } = this;
      switch (action) {
        case "zoomOut":
          if (transform.scale > 0.2) {
            transform.scale = parseFloat(
              (transform.scale - zoomRate).toFixed(3)
            );
          }
          break;
        case "zoomIn":
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case "clocelise":
          transform.deg += rotateDeg;
          break;
        case "anticlocelise":
          transform.deg -= rotateDeg;
          break;
      }
      transform.enableTransition = enableTransition;
    },
    handleClose1() {
      this.showMake = false;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose() {
      this.isCollapse = false;
    },
    openComment() {
      this.isCollapse = true;
      off(document, mousewheelEventName, this._mouseWheelHandler);
    },
    closeComment() {
      this.isCollapse = false;
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    closeAll() {
      this.isCollapse = false;
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
#app {
  width: 1440px;
  margin: 2px auto 0;
}
.swiperImg {
  margin-left: 240px;
  width: 968px;
  height: 726px;
  background: #e8ebf4;
  border-radius: 10px;
}
.swiper-slide__img {
  width: 100%;
  height: 726px;
}
::v-deep .swiper-button-next,
.swiper-button-prev {
  width: 32px;
  height: 80px;
  color: #999999;
}
::v-deep .swiper-wrapper {
  left: 5px;
}
::v-deep .el-dialog {
  width: 799px;
  background: #ffffff;
  border-radius: 10px;
  top: -63px;
  right: -100px;
}
.swiper {
  &.gallery-thumbs {
    margin-top: -128px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    padding: 27px 70px;
    width: 1440px;
    height: 190px;
    background: #e8ebf4;
    border-radius: 10px;
    &::before,
    &::after {
      z-index: 2;
      position: absolute;
      top: 0;
      content: "";
      height: 190px;
      width: 60px;
      background: #e8ebf4;
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
    .swiper-button-next,
    .swiper-button-prev {
      width: 48px;
      height: 136px;
      background: #1a1a1a;
      opacity: 0.3;
      top: 50% !important;
      transform: translateY(-50%) !important;
      margin-top: 0 !important;
      border-radius: 8px;
      color: #ffffff;
      &::after {
        font-size: 2rem;
      }
    }
  }
  .swiperImg2 {
    width: 184px;
    height: 136px;
    border-radius: 10px;
  }
  .swiper-slide__img2 {
    width: 100%;
    height: 136px;
  }
  &.gallery-thumbs .swiper-slide {
    opacity: 1;
    overflow: hidden;
  }
  &.gallery-thumbs .swiper-slide-thumb-active {
    opacity: 1;
  }
}
.showInfo {
  z-index: 4;
  text-align: center;
  line-height: 160px;
  width: 64px;
  height: 160px;
  color: #f3f4f4;
  background: #1a1a1a;
  opacity: 0.3;
  border-radius: 6px;
  position: relative;
  cursor: pointer;
  left: 1127px;
  top: -443px;
  border-radius: 4px;
}
.cellActive {
  width: 192px;
  height: 143px;
  border: 2px solid #1e78f0;
  border-radius: 6px;
}

</style>
