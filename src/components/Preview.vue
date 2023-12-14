<template>
  <div>
    <el-dialog width="1136px" :visible="dialogVisible" @close="close()">
      <div class="center-container">
        <div class="show">
          <el-row>
            <el-col>
              <div class="show-header">
                <div class="show-header-left">
                  <div class="show-header-left-thing-name">
                    {{ previewData.title }}
                  </div>
                  <div class="flex align-center" style="margin-top: 5px">
                    <!-- <el-avatar :size="30" :src="userInfo.avatar"></el-avatar> -->
                    <img
                      :src="userInfo.avatar"
                      class="show-header-avatar"
                      alt=""
                    />
                    <div class="user-profile">
                      <span class="username">
                        {{ userInfo.nick_name }}
                      </span>
                      <span class="datetime">
                        {{ previewData.editDatetime }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="show-thing">
                <div
                  class="carousel-box flex justify-between"
                  @mouseenter="enterCarousel"
                  @mouseleave="leaveCarousel"
                >
                  <div>
                    <div class="carousel">
                      <transition name="carousel-button-fade">
                        <div v-show="mouseEnterCarousel">
                          <button
                            class="ortur-icon-enlarge"
                            @click="openImageView()"
                          ></button>
                          <button
                            class="el-icon-arrow-up upCarousel"
                            @click="arrowClick()"
                          ></button>
                          <button
                            class="el-icon-arrow-down downCarousel"
                            @click="arrowClick('down')"
                          ></button>
                        </div>
                      </transition>
                      <el-carousel
                        direction="vertical"
                        height="496px"
                        :interval="3000"
                        arrow="hover"
                        ref="carousel"
                        indicator-position="none"
                        :autoplay="false"
                        @change="carouselChange"
                      >
                        <el-carousel-item
                          v-for="(item, index) in previewData.images"
                          :name="'' + index"
                          :key="item.id"
                          indicator-position="outside"
                          autoplay="true"
                        >
                          <img :src="item.url" />
                        </el-carousel-item>
                      </el-carousel>
                    </div>
                  </div>
                  <div v-swiper:mySwiper="swiperOptions">
                    <div class="swiper-wrapper">
                      <div
                        class="swiper-slide"
                        v-for="(item, index) in previewData.images"
                        :key="item.id"
                      >
                        <img
                          @click="changeImg(index)"
                          :class="
                            index === imgActiveIndex ? 'img-activeBorder' : ''
                          "
                          :src="item.url"
                          alt=""
                        />
                      </div>
                    </div>
                    <div class="swiper-scrollbar"></div>
                    <transition name="carousel-button-fade">
                      <div v-show="mouseEnterCarousel">
                        <div class="up swiper-container-button">
                          <i class="ortur-icon-arrow-up"></i>
                        </div>
                        <div class="down swiper-container-button">
                          <i class="ortur-icon-arrow-bottom"></i>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="flex justify-between bottom-content">
          <div class="bottom-content-left">
            <el-tabs
              class="description-tutorial-makes"
              type="border-card"
              :stretch="true"
              v-model="activeName"
            >
              <el-tab-pane label="Description" name="description">
                <show-more
                  :showHeight="showHeight"
                  v-if="activeName == 'description'"
                >
                  <pre>{{ previewData.description }}</pre>
                </show-more>
              </el-tab-pane>
              <el-tab-pane label="Tutorial" name="step">
                <show-more :showHeight="showHeight" v-if="activeName == 'step'">
                  <tutorial :step="previewData.tutorials"></tutorial>
                </show-more>
              </el-tab-pane>
              <!-- <el-tab-pane label="Makes" name="third">makes</el-tab-pane> -->
            </el-tabs>
          </div>
          <div class="bottom-content-right">
            <label-card :LabelArr="previewData.tags"></label-card>
          </div>
        </div>
        <ElImageViewer
          class="imageViewer"
          :on-close="closeViewer"
          :url-list="previewData.images"
          :initialIndex="imgActiveIndex"
          v-show="showViewer"
          :zIndex="imageViewerIndex"
        ></ElImageViewer>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import ElImageViewer from "@/components/ImageViewer.vue";
import Tutorial from "@/views/thing/components/Tutorial";
import ShowMore from "@/components/ShowMore.vue";
import LabelCard from "@/components/LabelCard.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");
export default {
  name: "Preview",
  components: { LabelCard, ShowMore, ElImageViewer, Tutorial },
  props: {
    dialogVisible: {
      type: Boolean,
    },
    close: {
      required: true,
      type: Function,
    },
    previewData: {
      type: Object,
    },
  },
  data() {
    return {
      imageList: [],
      showImg: [],
      waitImg: [],
      user: {},
      showViewer: false, // 显示查看器
      urlList: [], //大图列表
      imgActiveIndex: 0, // 当前移动图片的索引值
      activeName: "description",
      showHeight: 50,
      imageViewerIndex: 9999,
      swiperOptions: {
        // loop: true,
        direction: "vertical",
        mousewheel: true,
        slidesPerView: 4,
        // slidesPerGroup: 4,
        spaceBetween: 16,
        navigation: {
          nextEl: ".down",
          prevEl: ".up",
        },
        scrollbar: {
          el: ".swiper-scrollbar",
        },
      },
      mouseEnterCarousel: false,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    handleClose() {
      console.log("关闭模态框");
    },
    openImageView() {
      this.showViewer = true;
    },
    closeViewer() {
      this.showViewer = false;
    },
    changeImg(index) {
      this.$refs.carousel.setActiveItem(index);
      this.imgActiveIndex = index;
    },
    carouselChange() {
      this.imgActiveIndex = this.$refs.carousel.activeIndex;
      this.mySwiper.activeIndex = this.imgActiveIndex;
      this.mySwiper.slideTo(this.$refs.carousel.activeIndex, 1000, false);
    },
    arrowClick(val) {
      if (val === "down") {
        this.$refs.carousel.next();
      } else {
        this.$refs.carousel.prev();
      }
      console.log("refs:", this.$refs.carousel.activeIndex);
      this.imgActiveIndex = this.$refs.carousel.activeIndex;
      this.mySwiper.slideTo(this.$refs.carousel.activeIndex, 1000, false);
    },
    setActiveItem(index) {
      this.$refs.carousel.setActiveItem(index);
    },
    enterCarousel() {
      this.mouseEnterCarousel = true;
    },
    leaveCarousel() {
      this.mouseEnterCarousel = false;
    },
  },
  created() {},
  mounted() {
    console.log("gg", this.previewData);
  },
};
</script>
<style lang="scss" scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 8px;
  .username {
    color: #1a1a1a;
    font-size: 14px;
  }
  .datetime {
    font-size: 12px;
    color: #999999;
  }
}
.swiper-container {
  width: 184px;
  height: 496px;
  margin: 0;
  .swiper-wrapper {
    height: 496px;
    width: 184px;
    .swiper-slide {
      width: 184px;
      img {
        height: 112px;
        width: 100%;
        cursor: pointer;
        object-fit: contain;
        background: #e8ebf4;
      }
    }
  }
  .swiper-container-button {
    text-align: center;
    width: 100%;
    height: 24px;
    background: #1a1a1a;
    opacity: 0.3;
    z-index: 15;
    position: absolute;
    i {
      color: #fff;
      opacity: 1;
      font-size: 16px;
    }
  }
  .up {
    top: 0px;
    border-radius: 10px 10px 0px 0px;
  }
  .down {
    border-radius: 0px 0px 10px 10px;
    bottom: 0px;
  }
}
::v-deep .el-dialog {
  /* background: #f5f5f5; */
  background: #f0f3fa;
}
.center-container {
  margin: 0 auto;
  width: 1024px;
}
.el-tabs--border-card {
  /* background: #f5f5f5; */
  background: #f0f3fa;
  border: none;
  box-shadow: none;
}
.description-tutorial-makes {
  width: 100%;
  /* background-color: #f5f5f5; */
  background: #f0f3fa;
  margin-top: 0px;
}
.bottom-content {
  width: 1024px;
  margin: 0 auto;
  margin-top: 24px;
}

.bottom-content-left {
  width: 637px;
}

.bottom-content-right {
  width: 328px;
}
.el-icon-arrow-up {
  display: inline-block;
  cursor: pointer;
  border: none;
  padding: 0;
  position: absolute;
  width: 138px;
  height: 18px;
  background: #1a1a1a;
  opacity: 0.3;
  border-radius: 8px 8px 0px 0px;
  z-index: 8;
  color: white;
}

.el-icon-arrow-down {
  display: inline-block;
  cursor: pointer;
  border: none;
  padding: 0;
  position: absolute;
  width: 138px;
  height: 18px;
  background: #1a1a1a;
  opacity: 0.3;
  border-radius: 8px 8px 0px 0px;
  bottom: 0px;
  z-index: 8;
  color: white;
}
.ortur-icon-enlarge {
  width: 60px;
  height: 60px;
  background: #1a1a1a;
  opacity: 0.3;
  border-radius: 6px;
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 8;
  cursor: pointer;
}
.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

.align-center {
  align-items: center;
}
.show-thing {
  margin-top: 30px;

  .switchImage {
    width: 700px;
    height: 66px;
    background-color: #fff;

    img {
      margin-left: 6px;
      cursor: pointer;
      margin-top: 5px;
    }
  }
}
.show-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.show-header-left {
  display: flex;
  flex-direction: column;
  font-size: 18px;
  color: #1a1a1a;
  .show-header-avatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}

.show-header-left-thing-name {
  font-size: 18px;
  color: #1a1a1a;
  white-space: wrap;
  width: 568px;
}
.show-thing {
  width: 100%;
}
.carouselContainer {
  display: flex;
}

.carousel {
  position: relative;
  width: 807px;
  height: 496px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #e8ebf4;
  }
}
.downCarousel {
  width: 138px;
  height: 36px;
  background: #1a1a1a;
  opacity: 0.3;
  border-radius: 6px;
  left: 50%;
  bottom: 12px;
  margin-left: -64px;
}

.right-carousel {
  display: flex;
  width: 184px;
  text-align: center;
  flex-direction: column;
  position: relative;
  margin-left: 32px;
}

.upCarousel {
  width: 138px;
  height: 36px;
  background: #1a1a1a;
  opacity: 0.3;
  border-radius: 6px;
  left: 50%;
  top: 12px;
  margin-left: -64px;
}
.img-activeBorder {
  border: 1px solid #248bfb;
}
.imageViewer {
  z-index: 9999;
  ::v-deep .el-image-viewer__prev {
    background-color: black;
  }

  .ortur-iconb {
    font-size: 56px;
  }

  ::v-deep .el-image-viewer__btn {
    border-radius: 6px;
  }

  ::v-deep .el-icon-close:before {
    font-family: "icomoon";
    content: "\e922";
    color: #fff;
  }

  ::v-deep .el-icon-arrow-left:before {
    content: "\e6e1";
  }

  ::v-deep .el-icon-arrow-right:before {
    content: "\e6df";
  }

  ::v-deep .el-image-viewer__actions {
    display: none;
  }

  ::v-deep .el-image-viewer__prev {
    width: 324px;
    height: 60px;
    background: #1a1a1a;
    opacity: 0.3;
    border-radius: 6px;
    transform: translateX(-50%);
    left: 50%;
    top: 16px;
  }

  ::v-deep .el-image-viewer__next {
    width: 324px;
    height: 60px;
    background: #1a1a1a;
    opacity: 0.3;
    border-radius: 6px;
    // transform: translateX(-50%);
    // left: 50%;
    transform: translateX(-50%);
    left: 50%;
    bottom: 16px;
    top: auto;
  }

  ::v-deep .el-image-viewer__close {
    width: 60px;
    height: 60px;
    background: #1a1a1a;
    opacity: 0.3;
    border-radius: 6px;
    top: 16px;
    right: 16px;
  }

  ::v-deep .el-image-viewer__img {
    width: 1084px;
    height: 660px;
  }
}
::v-deep .el-dialog__header {
  padding: 0px;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding-top: 20px;
  padding-left: 0px;
  padding-right: 0px;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #fff;
  background-color: #f0f3fa;
  border-right-color: #f0f3fa;
  border-left-color: #f0f3fa;
  width: 120px;
  height: 40px;
  background: #1e78f0;
  border-radius: 8px;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border: none;
  background-color: #f0f3fa;
}
::v-deep .el-tabs--border-card {
  background: #f0f3fa;
  border: none;
}
::v-deep .el-tabs__header .is-top {
  width: 240px;
}
.carousel-button-fade-enter,
.carousel-button-fade-leave-to {
  opacity: 0;
}
.carousel-button-fade-enter-to,
.carousel-button-fade-leave {
  opacity: 1;
}
.carousel-button-fade-enter-active,
.carousel-button-fade-leave-active {
  transition: all 0.3s;
}
</style>
