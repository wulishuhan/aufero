<template>
  <div>
    <div class="download-card">
      <div class="left">
        <!-- <img
          :id="'file-' + file.id"
          :src="
            file.thumbnail != null
              ? file.thumbnail
              : file.url + '?not-from-cache-please'
          "
          alt=""
        /> -->
        <img
          v-if="isImage"
          :id="'file-' + file.id"
          :src="file.url + '?not-from-cache-please'"
          alt=""
        />
        <div class="no-img-file" v-else>
          <svg-icon icon-class="file" class-name="file"></svg-icon>
        </div>
        <div>
          <el-tooltip effect="dark" placement="bottom-start" :open-delay="1000">
            <div style="max-width: 270px" slot="content">{{ file.name }}</div>
            <div class="name">{{ file.name }}</div>
          </el-tooltip>
          <!-- <div class="name">{{ file.name }}</div> -->
          <div class="file-size-box">
            <span class="file-size">{{ fileSize }}</span>
            <span v-if="type == 'stl'" class="type">stl</span>
            <span v-else-if="type == 'png'" class="type">png</span>
            <span v-else-if="type == 'jpg'" class="type">jpg</span>
            <span v-else-if="type == 'jpeg'" class="type">jpeg</span>
            <span v-else-if="type == 'obj'" class="type">obj</span>
            <span v-else-if="type == 'svg'" class="type">svg</span>
            <span v-else-if="type == 'gc'" class="type">gc</span>
            <span v-else-if="type == 'dxf'" class="type">dxf</span>
            <span v-else-if="type == 'nc'" class="type">nc</span>
            <span v-else-if="type == 'code'" class="type">code</span>
            <span v-else class="type">other</span>
          </div>
          <div class="time">
            <span>
              {{ $t("thing.updated") }}
              {{ $d(new Date(file.createTime), "short") }}
            </span>
          </div>
        </div>
      </div>
      <el-button @click.prevent.stop="download" type="primary">
        <i class="ortur-icon-arrow-down"></i>
        <!-- <span class="download-text">{{ file.downloadCount }} </span> -->
        <span class="download-text">{{ downloadNum }} </span>
      </el-button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { saveAs } from "file-saver";
export default {
  name: "DownloadCard",
  props: {
    file: Object,
    default: () => {
      return {
        name: "Headset_Holder_v1.stl",
        url: "https://cdn.thingiverse.com/assets/a0/23/4c/6f/68/medium_thumb_Headset_Holder_v1.png?not-from-cache-please",
        size: "1000",
        updatedTime: "05-17-2022",
        downloadCount: 511,
        type: "stl",
      };
    },
  },
  data() {
    return {
      type: "",
      downloadNum: 0,
    };
  },
  computed: {
    fileSize() {
      let sizeText = "";
      if (this.file.size > 1024 * 1024) {
        sizeText = Math.floor(this.file.size / 1024 / 1024) + "M";
      } else if (this.file.size > 1024) {
        sizeText = Math.floor(this.file.size / 1024) + "KB";
      } else {
        sizeText = Math.floor(this.file.size) + "B";
      }
      return sizeText;
    },
    downloadUrl() {
      return `${process.env.VUE_APP_BASE_API}/library/resource/download/${this.file.id}?not-from-cache-please`;
    },
    isImage() {
      return ["jpeg", "png", "jpg", "svg"].includes(this.type);
    },
  },
  mounted() {
    let arr = this.file.name.split(".");
    this.type = arr[arr.length - 1].toLocaleLowerCase();
    this.downloadNum = this.file.downloadCount;
  },
  methods: {
    download() {
      //?not-from-cache-please是处理google浏览器下载跨域
      axios
        .get(this.downloadUrl, {
          responseType: "blob",
          method: "get",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => {
          saveAs(res.data, this.file.name);
          this.downloadNum += 1;
          this.$emit("addDownloadCount");
        })
        .catch(() => {
          console.log("下载失败使用使用自定义方法下载！");
          this.downloadFileUsingCanvasAndOpenWindow();
        });
    },
    // 使用canvas下载跨域图片文件的方法， 可以使用window.open()下载非浏览器直接可以预览的文件
    downloadUsingCanvas() {
      console.log("图片!");
      try {
        let image = new Image();
        image.crossOrigin = "anonymous";
        image.setAttribute("crossOrigin", "anonymous");
        image.src = this.file.url + "?not-from-cache-please";
        let that = this;
        image.onload = function () {
          let c = document.createElement("canvas");
          let ctx = c.getContext("2d");
          c.width = this.width;
          c.height = this.height;
          ctx.clearRect(0, 0, c.width, c.height);
          ctx.drawImage(image, 0, 0, c.width, c.height);
          c.toBlob(function (blob) {
            saveAs(blob, that.file.name);
          });
        };
      } catch (error) {
        console.log("canvas存在问题", error);
      }
    },
    downloadFileUsingCanvasAndOpenWindow() {
      let imageType = ["jpg", "png", "gif", "jpeg", "svg"];
      if (imageType.includes(this.type)) {
        this.downloadUsingCanvas();
        this.downloadNum += 1;
      } else {
        window.open(this.file.url);
        this.downloadNum += 1;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.no-img-file {
  width: 88px;
  height: 66px;
  margin-right: 10px;
  background: #e8ebf4;
  color: #c2c4cc;
  text-align: center;
  line-height: 80px;
  .file {
    width: 22px;
    height: 28px;
  }
}
.download-card {
  background-color: #fff;
  width: 544px;
  padding: 10px 1px;
  text-align: left;
  margin: 0 auto;
  // border-bottom: solid 1px #ccc;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    display: flex;
  }
  .name {
    width: 288px;
    font-size: 16px;

    font-weight: 400;
    color: #1a1a1a;
    margin-bottom: 2px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 24px;
  }
  .type {
    width: 28px;
    height: 12px;
    background: #1a1a1a;
    border-radius: 3px;
    padding: 0 5px;
    margin-left: 2px;
    color: white;
    line-height: 12px;
  }
  .time {
    margin-top: 6px;
    font-size: 14px;

    font-weight: 400;
    color: #999999;
  }
  .file-size-box {
    margin-top: 8px;
  }
  .file-size {
    margin-right: 17px;
    display: inline-block;
    width: 41px;
  }
  img {
    width: 88px;
    height: 66px;
    object-fit: contain;
    margin-right: 10px;
    background: #e8ebf4;
  }
  span {
    font-size: 14px;

    font-weight: 400;
    color: #999999;
  }
}
.el-button {
  width: 80px;
  height: 48px;
  background: #1e78f0;
  border-radius: 8px;
  font-size: 16px;

  font-weight: 400;
  color: #ffffff;
  padding: 17px;
}
.download-text {
  color: #fff !important;
  margin-left: 10px;
  font-size: 16px !important;
}
.ortur-icon-arrow-down {
  font-size: 12px;
}
</style>
