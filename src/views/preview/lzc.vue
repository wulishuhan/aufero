<template>
  <div>
    <transition>
      <div>
        <div class="thumb-example">
          <!-- swiper1 -->
          <swiper
            class="gallery gallery-top"
            ref="swiper"
            :options="swiperOptions"
          >
            <swiper-slide
              class="slide-1"
              v-for="(item, index) in ArrList"
              :key="index"
            >
              <img class="slide-Img" :src="item" alt="" />
            </swiper-slide>
            <div
              @click="perNumber"
              class="swiper-button-prev"
              slot="button-prev"
            ></div>
            <div
              @click="nextNumber"
              class="swiper-button-next"
              slot="button-next"
            ></div>
          </swiper>
          <div @click="openComment" class="showInfo">
            <i class="el-icon-arrow-left"></i>
            <i class="ortur-icon-message"></i>
          </div>
          <!-- 缩略图 -->
          <div class="swiper2Box">
            <swiper
              class="thumbs gallery-thumbs"
              :options="swiperOptionThumbs"
              ref="swiperThumbs"
            >
              <swiper-slide
                class="slide-2"
                v-for="(item, index) in ArrList"
                :key="index"
              >
                <img
                  class="slide-Img2"
                  @click="selectswiper(index)"
                  :style="{
                    border: index === number ? '2px solid red' : '',
                  }"
                  :src="item"
                  alt=""
                />
              </swiper-slide>

              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
          </div>
        </div>
      </div>
    </transition>
    <el-dialog
      :visible.sync="isCollapse"
      width="799px"
      height="728px"
      :modal="false"
      :before-close="handleClose"
    >
      <div style="height: 100%; width: 100%">
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
import Swiper from "swiper";
import "swiper/css/swiper.css";
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
        loopedSlides: 5, // looped slides should be the same
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      swiperOptionThumbs: {
        loopedSlides: 5, // looped slides should be the same
        spaceBetween: 32,
        slideToClickedSlide: true,
        autoScrollOffset: 0,
        slidesPerGroup: 6, //6张图片为一组
        slidesPerView: 6, //显示的图片张数
        touchRatio: 0.2,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
  mounted() {
    // 负责切换功能
    var mySwiper = new Swiper(".gallery", {
      spaceBetween: 10,
      loopedSlides: 5,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: {
          el: ".thumbs",
          loopedSlides: 5,
          slideToClickedSlide: true,
          autoScrollOffset: 0,
          slidesPerGroup: 6, //6张图片为一组
          slidesPerView: 6, //显示的图片张数
          spaceBetween: 32,
          touchRatio: 0.2,
          watchSlidesVisibility: true,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        },
      },
    });
  },
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
    perNumber() {
      this.number = this.number - 1;
      console.log(this.number, 226);
    },
    nextNumber() {
      this.number = this.number + 1;
      console.log(this.number, 226);
    },
    selectswiper(index) {
      this.number = index;
      console.log(this.number, 245);
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
::v-deep .el-dialog__header {
  padding: 9px 6px 7px;
}
::v-deep .el-dialog__body {
  padding: 30px 20px 10px 10px;
}
.hide {
  display: none;
}
.el-image-viewer__canvas {
  position: relative;
  margin: 0 auto;
  background: #fff;
  position: fixed;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  max-width: 1432px !important;
  max-height: 752px !important;
  width: 80%;
  height: 90%;
}
.el-image-viewer__img {
  object-fit: contain;
  /* height: 892px; */
  width: 100%;
  height: 100%;
}
.comment-box {
  width: 100%;
  height: 728px;
  background: #ffffff;
  display: flex;
  align-items: center;
}
.open-comment-box {
  width: 64px;
  height: 160px;
  background: rgba(26, 26, 26, 0.3);
  border-radius: 6px;
  position: absolute;
  right: 16px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.open-comment-box:hover {
  cursor: pointer;
}
::v-deep .el-dialog {
  overflow: hidden;
  position: absolute;
  top: -47px;
  right: 400px;
  z-index: 3000;
  height: 728px;
  background: #ffffff;
  border-radius: 10px;
  overflow-y: scroll;
}
.el-button {
  border: none;
}
.el-image-viewer__prev {
  background-color: rgba(26, 26, 26, 0.3);
}
.el-image-viewer__btn {
  border-radius: 6px;
}
.el-image-viewer__actions {
  display: none;
}
.makeCard {
  display: flex;
  justify-content: space-between;
  border: 1px solid #f0f3fa;
  flex-wrap: wrap;
  width: 344px;
  height: 328px;
  border-radius: 10px;
  padding: 8px;
}
.makeCard:hover {
  border: 1px solid #c2c4cc;
  box-shadow: 0px 2px 10px 0px rgba(18, 18, 18, 0.07);
  border-radius: 10px;
  padding: 8px;
}
.makeContent {
  font-size: 14px;
  
  font-weight: 400;
  color: #1a1a1a;
}
.makeName {
  font-size: 12px;
  
  font-weight: 400;
  color: #999999;
}
.moreMenu {
  z-index: 9999;
  position: absolute;
  width: 160px;
  // height: 176px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  text-align: left;
  bottom: 35px;
  right: 7px;
  .moreMenuItem {
    width: 144px;
    height: 48px;
    border-radius: 8px;
    line-height: 48px;
    margin: 8px auto;
    padding-left: 25px;
  }
  .moreMenuItem:hover {
    background: #8ab5ef;
  }
}
.makes-mask {
  display: flex;
  justify-content: space-between;
  position: absolute;
  margin-bottom: 55px;
  bottom: 3px;
  width: 328px;
  height: 32px;
  background-color: rgba(34, 34, 34, 0.5);
  text-align: center;
  line-height: 32px;
  .ortur-icon-message {
    position: relative;
    top: 2px;
    margin-left: 10px;
  }
  .makes-mask-font-container {
    color: #fff;
    font-size: 16px;
  }
}
.more-image-box {
  margin-top: 31px;
  cursor: pointer;
  display: grid;
  grid-template-columns: repeat(3, 184px);
  justify-content: space-between;
}

.more-image {
  width: 328px;
  height: 248px;
  margin-top: 5px;
  background: #e8ebf4;
  cursor: pointer;
}

::v-deep .el-image-viewer__img {
  width: 1084px;
  height: 660px;
}
::v-deep .el-image-viewer__close {
  background-color: rgba(26, 26, 26, 0.3);
  border-radius: 0px;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  font-size: 14px;
}
.makes-mask:hover {
  cursor: pointer;
}
.icon-collect-box {
  width: 56px;
  height: 40px;
  background: #ff5e5e;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 100px;
  right: 24px;
  cursor: pointer;
}

::v-deep .el-carousel__container {
  height: 533px;
}

// ::v-deep .gallery-top {
//   overflow: visible;
// }
.thumb-example {
  margin: auto;
  width: 100%;
}
.swiper-slide {
  background-size: cover;
  background-position: center;
}
.gallery-top {
  height: 746px;
  width: 962px;
}
.swiper-button-next {
  position: relative;
  right: 290px;
  color: #999999;
  position: fixed;
}
.swiper-button-prev {
  position: relative;
  left: 290px;
  color: #999999;
  position: fixed;
}
.swiper2Box {
  margin-left: 20px;
  padding-top: 10px;
  width: 1440px;
  height: 176px;
  background: #e8ebf4;
  border-radius: 10px;
  // position: absolute;
  // left: 305px;
}
.gallery-thumbs {
  box-sizing: border-box;
  padding: 10px 0px;
  width: 1264px;
  height: 156px;
  background: #e8ebf4;
  border-radius: 10px;
  .swiper-button-next {
    width: 48px;
    height: 130px;
    background: #1a1a1a;
    opacity: 0.3;
    border-radius: 8px;
    text-align: center;
    top: 901px;
    right: 315px;
    color: #f3f4f4;
    div {
      margin-top: 30px;
      background: rgb(207, 205, 205);
      height: 45px;
      border-radius: 50%;
      img {
        margin: 7px 0 0 2px;
        width: 30px;
      }
    }
  }
  .swiper-button-prev {
    width: 48px;
    height: 130px;
    background: #1a1a1a;
    opacity: 0.3;
    border-radius: 8px;
    text-align: center;
    top: 901px;
    left: 315px;
    color: #f3f4f4;
    div {
      margin-top: 30px;
      background: rgb(207, 205, 205);
      height: 45px;
      border-radius: 50%;
      img {
        margin: 7px 0 0 2px;
        width: 30px;
      }
    }
  }
  .swiper-button-next:hover div {
    background: rgb(189, 186, 186);
  }
  .swiper-button-prev:hover div {
    background: rgb(189, 186, 186);
  }
}
.gallery-thumbs .swiper-slide {
  width: 20%;
  height: 136px;
  // opacity: 0.4;
}
// .swiper-slide-active {
//   border: 2px solid red;
// }
.slide-1 {
  width: 968px;
  background: #ff7fa2;
  border-radius: 10px;
  height: 726px;
}
.slide-Img {
  height: 726px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}
.slide-2 {
  width: 184px;
  height: 132px;
}
.slide-Img2 {
  width: 100%;
  height: 132px;
}
.showInfo {
  z-index: 3;
  text-align: center;
  line-height: 160px;
  width: 64px;
  height: 160px;
  color: #f3f4f4;
  background: #1a1a1a;
  opacity: 0.3;
  border-radius: 6px;
  position: absolute;
  cursor: pointer;
  left: 1425px;
  top: 367px;
  border-radius: 4px;
}
</style>
