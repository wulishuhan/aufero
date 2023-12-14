<template>
  <div v-swiper:[swiperName]="swiperOptions">
    <draggable
      class="swiper-wrapper"
      handle=".handle"
      draggable=".swiper-slide.draggable"
      v-model="itemList"
      :move="onMoveCallback"
      :style="itemList.length > 4 ? 'padding: 0px 0px 16px' : ''"
    >
      <div
        class="swiper-slide draggable"
        v-for="(item, itemKey) in itemList"
        :key="itemKey"
      >
        <img :src="item.url" />
        <!-- img-toolbar  -->
        <div class="img-toolbar">
          <i class="ortur-icon-minus" @click="remove(itemKey, groupKey)">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <i class="handle ortur-icon-settings-gray swiper-no-swiping"> </i>
          <el-upload
            class="cover-edit"
            action=""
            :show-file-list="showFile"
            :file-list="itemList"
            :on-success="onEditSuccess"
            :headers="headers"
            :accept="config.pictureAcceptType"
            :before-upload="beforeUpload"
            :http-request="handleRequest"
          >
            <i
              class="ortur-icon-pen"
              @click="setCurrentKeyList([itemKey, groupKey])"
            ></i>
          </el-upload>
        </div>
        <!-- // tootbar -->
      </div>
      <div class="swiper-slide">
        <el-upload
          action=""
          :show-file-list="showFile"
          class="cover-add"
          :file-list="itemList"
          :on-success="onAddSuccess"
          :headers="headers"
          accept=".png,.jpg,.svg,.jpeg"
          :before-upload="beforeUpload"
          :http-request="handleRequest"
          :limit="config.coverLimit"
          :on-exceed="handleExceed"
        >
          <i class="el-icon-plus" @click="setCurrentKeyList([0, groupKey])"></i>
        </el-upload>
      </div>
    </draggable>
    <div
      ref="swiperPrev"
      style="opacity: 0"
      class="swiper-button-prev swiper-button-black"
      @drop="drop($event)"
      @dragover="allowDrop($event, 'swiperPrev')"
    ></div>
    <!-- 白色 -->
    <div
      ref="swiperNext"
      style="opacity: 0"
      @drop="drop($event)"
      @dragover="allowDrop($event, 'swiperNext')"
      class="swiper-button-next swiper-button-black"
    ></div>
    <!-- 黑色 -->
    <div class="swiper-scrollbar"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import draggable from "vuedraggable";
import { getResouceUploadS3Url } from "@/api/resource";
import { generatorThumbnail } from "@/utils/generateImage";
import axios from "axios";
export default {
  model: {
    prop: "data",
    // 随便命名事件，对应下面$emit即可
    event: "changeData",
  },
  data() {
    return {
      swiperOptions: {
        observer: true,
        slidesPerView: 5,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        scrollbar: {
          el: ".swiper-scrollbar",
        },
      },
      itemList: [],
    };
  },
  components: {
    draggable,
  },
  props: {
    swiperName: {
      type: String,
      required: true,
    },
    groupKey: {
      type: Number,
      default: 0,
    },
    showFile: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
    },
    onAddSuccess: {
      type: Function,
      required: true,
    },
    onEditSuccess: {
      type: Function,
      required: true,
    },
    remove: {
      type: Function,
      required: true,
    },
    currentKeyList: {
      type: Array,
      default: () => {
        return [0, 0];
      },
    },
  },
  watch: {
    itemList: function (val) {
      this.$emit("changeData", val);
    },
  },
  created() {
    this.itemList = this.data;
    this._throttle = this.throttle((swiperArrow) => {
      //滚动
      this.$refs[swiperArrow].click();
    }, 500);

    this._throttle_tutorial = this.throttle((swiperArrow, curIndex) => {
      //滚动
      this.$refs[swiperArrow][curIndex].click();
    }, 500);
  },
  computed: {
    ...mapState({
      headers: (state) => state.user.headers,
      config: (state) => state.user.config,
    }),
  },
  methods: {
    handleExceed() {
      this.$message({
        message: this.$t("upload.fileExceed", [this.config.coverLimit]),
        type: "warning",
      });
    },
    onMoveCallback() {
      //   console.log("移动事件", evt, originalEvent);
    },
    setCurrentKeyList(keyList) {
      this.$emit("update:currentKeyList", keyList);
    },
    drop(event) {
      event.preventDefault();
    },
    allowDrop(event, swiperArrow, curIndex) {
      if (/^tutorial/.test(swiperArrow)) {
        this._throttle_tutorial(swiperArrow, curIndex);
      } else {
        this._throttle(swiperArrow);
      }
      event.preventDefault();
    },
    throttle(func, delay) {
      delay = delay || 1000;
      var previousDate = new Date();
      var previous = previousDate.getTime(); // 初始化一个时间，也作为高频率事件判断事件间隔的变量，通过闭包进行保存。

      return function (...args) {
        var context = this;
        var nowDate = new Date();
        var now = nowDate.getTime();
        if (now - previous >= delay) {
          // 如果本次触发和上次触发的时间间隔超过设定的时间
          func.apply(context, args); // 就执行事件处理函数 （eventHandler）
          previous = now; // 然后将本次的触发时间，作为下次触发事件的参考时间。
        }
      };
    },
    handleRequest({ file, onProgress, onSuccess }) {
      var data;
      var tmpFile;
      getResouceUploadS3Url({
        name: file.name,
        size: file.size,
        type: file.type,
      })
        .then((res) => {
          if (res.data.code == 0) {
            let presignUrl = res.data.data.presignUrl;

            data = res.data.data;
            return axios.put(presignUrl, file, {
              headers: {
                "Content-Type": file.type,
              },
              onUploadProgress: (progressEvent) => {
                onProgress(progressEvent);
              },
            });
          } else {
            return Promise.reject("error");
          }
        })
        .then(() => {
          //生成缩略图
          return generatorThumbnail(file, 400, 300);
        })
        .then((thumbFile) => {
          tmpFile = thumbFile;
          //上传缩略图
          return getResouceUploadS3Url({
            name: thumbFile.name,
            size: thumbFile.size,
            type: thumbFile.type,
          });
        })
        .catch(() => {
          // 非png jpg jpeg 文件时处理
          tmpFile = file;
          return getResouceUploadS3Url({
            name: file.name,
            size: file.size,
            type: file.type,
          });
        })
        .then((res) => {
          if (res.data.code == 0) {
            let presignUrl = res.data.data.presignUrl;
            data.thumbnail = res.data.data.url;
            return axios.put(presignUrl, tmpFile, {
              headers: {
                "Content-Type": tmpFile.type,
              },
            });
          } else {
            return Promise.reject("error");
          }
        })
        .then(() => {
          // console.log("上传成功", data);
          onSuccess(data);
        })
        .catch((e) => {
          console.log("error:", e);
        });
    },
    beforeUpload(file) {
      let extension = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      let accept =
        this.config.pictureAcceptType.indexOf(extension) < 0 ? false : true;
      accept = ["png", "jpg", "jpeg", "svg"].includes(extension);
      console.log("accept: ", accept);
      if (file.name.length > 50) {
        this.$message({
          message: this.$t("upload.filenameTooLong"),
          type: "warning",
        });
        return false;
      }

      //校验文件大小
      if (file.size > this.config.maxPictureSize) {
        this.$message({
          message: this.$t("upload.fileTooLarge", [
            this.formatFileSize(this.config.maxPictureSize, 0),
          ]),
          type: "warning",
        });
        return false;
      }
      if (!accept) {
        this.$message({
          message: "Supported Files:" + this.config.pictureAcceptType,
          type: "warning",
        });
        return false;
      }

      return accept;
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper-button-next,
.swiper-button-prev {
  width: 0;
}

.swiper-button-next {
  right: 12px;
}

.swiper-button-prev {
  left: 12px;
}

.swiper-slide {
  position: relative;

  .img-toolbar {
    display: none;
    width: 184px;
    height: 112px;
    margin: 0 auto;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -92px;
    background: rgba(0, 0, 0, 0.4);

    i {
      cursor: pointer;
      display: none;
      font-size: 20px;
    }

    .ortur-icon-minus {
      font-size: 20px;
      position: absolute;
      top: 5px;
      right: 10px;
      cursor: pointer;
    }

    .cover-edit {
      font-size: 20px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -12px;
      margin-top: -14px;
      cursor: pointer;
      color: #fff;
    }

    .handle {
      position: absolute;
      bottom: 5px;
      right: 10px;
      font-size: 14px;
      cursor: move;
    }

    .handle:before {
      color: #eee;
    }
  }

  .cover-add {
    width: 184px;
    height: 100%;
    border: 1px solid #cccccc;
    border-radius: 6px;
    font-size: 34px;
    margin: auto;

    ::v-deep .el-upload {
      width: 100%;
      height: 100%;

      .el-icon-plus {
        line-height: 112px;
        width: 100%;
      }
    }

    i {
      display: block;
    }
  }

  img {
    display: block;
    margin: 0px auto;
    width: 184px;
    height: 112px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #eee;
  }
}

.swiper-slide:hover {
  i {
    display: block;
  }

  .img-toolbar {
    display: block;
  }
}
</style>
