<template>
  <div @click="closeDownPanel" class="container">
    <div class="button">
      <div class="downPanel" v-show="isShowDownPanel">
        <div class="downLoadAll">
          <span class="fileNum">
            {{ fileNum }}{{ $t("download.fileNum") }}
          </span>
          <a
            class="a"
            :style="[{ color: fileList.length > 0 ? '#1e78f0' : 'gray' }]"
            @click="downLoadAll"
            >{{ $t("download.downloadAll") }}</a
          >
        </div>
        <download-card
          v-for="item in fileList"
          :file="item"
          :key="item.id"
        ></download-card>
      </div>
    </div>
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
      colorGray: {
        color: "black",
        // cursor: "not-allowed",
      },
    };
  },
  mounted() {},
  computed: {
    numText() {
      let numText = "";
      if (this.downLoadNum < 0) {
        numText = "0";
      } else if (this.downLoadNum < 1000) {
        numText = "" + this.downLoadNum;
      } else {
        numText = Math.floor(this.downLoadNum / 1000) + "k";
      }
      return numText;
    },
  },
  methods: {
    async downLoadAll() {
      if (this.fileList.length == 0) {
        return false;
      } else {
        let zip = new JSZip();
        for (let i = 0; i < this.fileList.length; i++) {
          const element = this.fileList[i];
          let res = await getFileData(element.id);
          // if (!res) {
          //   return;
          // }
          zip.file(element.name, res);
        }
        zip.generateAsync({ type: "blob" }).then((content) => {
          // see FileSaver.js
          saveAs(content, this.resourceName + ".zip");
        });
      }
    },
    closeDownPanel() {
      //console.log(e)
      // this.isShowDownPanel = false;
    },
    showDownPanel() {
      this.$emit("click");
      // this.isShowDownPanel = !this.isShowDownPanel;
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
.container {
  position: fixed;
  left: 50%;
  // transform: translateX(-50%);
  top: 50%;
  // transform: translateY(-50%);
  z-index: 100;
  margin-left: -296px;
  margin-top: -240px;
}
.button {
  color: #fff;
  padding: 0px 5px;
  .num {
    color: #fff;
    opacity: 0.5;
    padding: 0px 10px;
  }
  .downPanel {
    width: 592px;
    height: 480px;
    background: #ffffff;
    border-radius: 20px;
    overflow: auto;
    z-index: 9;
    .a {
      color: #1e78f0;
      cursor: pointer;
    }
    .downLoadAll {
      .fileNum {
        font-size: 12px;

        font-weight: 400;
        color: #999999;
      }
      display: flex;
      justify-content: space-between;
      padding: 15px 29px;
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
}
</style>
