<template>
  <div @click="closeDownPanel">
    <el-button class="baseButton button" @click.stop="showDownPanel">
      <div class="downPanel" @click.stop="stopBublet" v-show="isShowDownPanel">
        <div class="downLoadAll">
          <span>
            <span class="fileNum">
              {{ fileNum }}{{ $t("download.fileNum") }}
            </span>
            <span class="sizeSun">
              {{ this.sizeSun }}
            </span>
          </span>
          <a class="download-all-tag" @click="downLoadAll">{{
            $t("download.downloadAll")
          }}</a>
        </div>
        <download-card
          v-for="item in fileList"
          :file="item"
          :key="item.id"
          @addDownloadCount="addDownloadCount"
        ></download-card>
      </div>
      <span class="ortur-icon-file-download el-icon--left" style="color: #fff">
        <span class="path1"></span><span class="path2"> </span>
      </span>
      <span class="download-text"> {{ $t("thing.Download") }} </span>
      <span class="num">{{ numText }}</span>
      <i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
  </div>
</template>

<script>
import DownloadCard from "./DownloadCard";
import { getFileData } from "@/utils/exportZip.js";
import { saveAs } from "file-saver";
import JSZip from "jszip";
export default {
  components: {
    DownloadCard,
  },
  data() {
    return {
      count: 0,
      Sum: "",
      sizeSun: "",
    };
  },
  computed: {
    numText() {
      console.log("tnnd:", this.count);
      let numText = "";
      if (this.count < 0) {
        numText = "0";
      } else if (this.count < 1000) {
        numText = "" + this.count;
      } else {
        numText = Math.floor(this.count / 1000) + "k";
      }
      return numText;
    },
  },
  watch: {
    downLoadNum() {
      this.count = this.downLoadNum;
    },
  },
  methods: {
    async downLoadAll() {
      let zip = new JSZip();
      for (let i = 0; i < this.fileList.length; i++) {
        const element = this.fileList[i];
        let res = await getFileData(element.id, process.env.VUE_APP_BASE_API);
        console.log(res, 87);
        zip.file(element.name, res);
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        // see FileSaver.js
        saveAs(content, this.resourceName + ".zip");
        this.count += this.fileList.length;
      });
    },
    closeDownPanel() {
      //console.log(e)
      // this.isShowDownPanel = false;
    },
    showDownPanel() {
      {
        this.Sum = 0;
        for (let index = 0; index < this.fileList.length; index++) {
          this.Sum += Number(this.fileList[index].size);
          this.Sum = Number(this.Sum);
        }
        if (this.Sum > 1024 * 1024) {
          this.sizeSun = Math.floor(this.Sum / 1024 / 1024) + "M";
        } else if (this.Sum > 1024) {
          this.sizeSun = Math.floor(this.Sum / 1024) + "KB";
        } else {
          this.sizeSun = Math.floor(this.Sum) + "B";
        }
        console.log(this.sizeSun);
        // return sizeSun;
      }
      this.$emit("click");
    },
    stopBublet() {},
    addDownloadCount() {
      this.count++;
    },
  },
  props: {
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    downLoadNum: {
      type: Number,
      default: 0,
    },
    fileNum: {
      type: Number,
      default: 12,
    },
    isShowDownPanel: {
      type: Boolean,
      default: false,
    },
    resourceName: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  width: 200px;
  height: 48px;
  position: relative;
  background-color: #1e78f0;
  color: #fff;
  .num {
    color: #fff;
    opacity: 0.5;
    padding: 0px 10px;
    font-size: 16px;
  }
  .downPanel {
    position: absolute;
    width: 592px;
    height: 480px;
    background: #ffffff;
    border-radius: 20px;
    top: 60px;
    /* left: -358px; */
    right: -2px;
    overflow: auto;
    z-index: 9;
    .downLoadAll {
      .sizeSun {
        margin-left: 5px;
        font-size: 16px;

        font-weight: 400;
        color: #999999;
      }
      .fileNum {
        font-size: 16px;

        font-weight: 400;
        color: #999999;
      }
      display: flex;
      justify-content: space-between;
      padding: 15px 29px;
      .download-all-tag {
        font-size: 16px;
        color: #1e78f0;
      }
    }
  }
  .downPanel::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .downPanel::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #535353;
  }
  .downPanel::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }
}
/* .button:hover .downPanel { */
/* display: block; */
/* } */
.ortur-icon-file-download {
  font-size: 18px;
  color: #fff;
}
.path1::before,
.path2::before {
  color: #fff;
  font-size: 18px;
}
.download-text {
  font-size: 16px;
  margin-left: 0px !important;
}
.el-icon-arrow-down {
  position: relative;
  top: -2px;
}
</style>
