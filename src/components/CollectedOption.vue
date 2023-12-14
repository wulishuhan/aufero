<template>
  <div v-show="show" class="collected-option-box" @click.stop="stop">
    <span class="collect-to">Collect to</span>
    <el-checkbox-group class="folder-button-box" v-model="checkList">
      <p v-for="item in folder" :key="item.id">
        <el-checkbox class="folder-button" :label="item">
          <el-tooltip effect="light" placement="left-start">
            <div class="name-tip" slot="content">
              {{ item.name }}
            </div>
            <span class="folder-button-text">
              <i class="el-icon-folder" v-show="item.id !== 0"></i>
              {{ item.name }}
            </span>
          </el-tooltip>
        </el-checkbox>
      </p>
    </el-checkbox-group>
    <a
      v-if="isNewFileLink"
      class="el-icon-plus new-file"
      @click="isNewFileLink = false"
      >New File
    </a>
    <el-input
      v-if="!isNewFileLink"
      v-model="newFolderName"
      @keyup.enter.native="addFolder"
      @blur="addFolder"
      class="new-file-input"
      placeholder="press enter to add new folder"
    ></el-input>
    <div class="button-group">
      <el-button class="cancel-button" @mousedown.native="cancelFolder"
        >Cancel</el-button
      >
      <el-button
        class="move-button"
        :class="{ 'input-move-button-background': !isNewFileLink }"
        :disabled="!isNewFileLink"
        @mousedown.native="selectFolderToCollected"
      >
        Comfirm
      </el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    folders: {
      type: Array,
      default: () => [
        {
          name: "a",
          id: 1,
        },
        {
          name: "b",
          id: 2,
        },
        {
          name: "c",
          id: 3,
        },
      ],
    },
  },
  mounted() {},
  data() {
    return {
      isNewFileLink: true,
      checkList: [],
      select: {},
      newFolderName: "",
    };
  },
  computed: {
    folder() {
      return [{ id: 0, name: "Draft" }, ...this.folders];
    },
  },
  watch: {
    show(newVal, oldVal) {
      if (newVal) {
        console.log("----------------");
        document.body.parentNode.style.overflow = "hidden";
      } else {
        document.body.parentNode.style.overflow = "scroll";
      }
      if (!newVal) this.cancelFolder();
    },
  },
  destroyed() {
    // 组件卸载的时候要保住滚动条可用
    document.body.parentNode.style.overflow = "scroll";
  },
  methods: {
    addFolder(e) {
      // 去除两端空格
      this.newFolderName = this.newFolderName.replace(/(^\s*)|(\s*$)/g, "");
      if (e.keyCode === 13) {
        this.isNewFileLink = true;
        // 火狐浏览器回车不会触发失焦事件需要手动处理
        if (
          navigator.userAgent.includes("Firefox") &&
          this.newFolderName !== ""
        ) {
          this.$emit("addFolder", this.newFolderName);
          this.newFolderName = "";
        }
        return;
      }
      this.isNewFileLink = true;
      if (this.newFolderName !== "") {
        this.$emit("addFolder", this.newFolderName);
        this.newFolderName = "";
      }
    },
    cancelFolder(e) {
      this.newFolderName = "";
      this.isNewFileLink = true;
      this.$emit("close");
    },
    diff(preList, currentList) {
      let addList = currentList.filter((item) => {
        if (!preList.includes(item)) {
          return item;
        }
        console.log(addList, 126);
      });
      let deleteList = preList.filter((item) => {
        if (!currentList.includes(item)) {
          return item;
        }
        console.log(deleteList, 126);
      });
      return { addList, deleteList };
    },
    selectFolderToCollected() {
      this.$emit("moveFolder", this.select);
    },

    // 阻止冒泡
    stop() {},
  },
};
</script>

<style></style>
<style lang="scss" scoped>
.name-tip {
  max-width: 100px;
}
.collected-option-box {
  z-index: 1000;
  margin: auto;
  width: 224px;
  height: 360px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0px 8px;
  
  font-weight: 400;
  border: solid 1px #ccc;
  .collect-to {
    height: 36px;
    width: 208px;
    font-size: 14px;
    
    font-weight: 400;
    color: #999999;
    text-align: center;
    line-height: 36px;
    border-bottom: solid #ccc 1px;
  }
  .folder-button-box {
    height: 144px;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    .folder-button {
      font-size: 14px;
      
      font-weight: 400;
      color: #1a1a1a;
      width: 100%;
      height: 48px;
      line-height: 48px;
      border-radius: 8px;
      text-align: start;
      .folder-button-text {
        margin-left: 0px;
        .el-icon-folder {
          font-size: 16px;
        }
      }
    }
    ::v-deep .el-radio-button__inner {
      width: 100%;
      border: none;
      text-align: left;
      white-space: nowrap;
      width: 205px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #fff;
      background-color: #8ab5ef;
      box-shadow: -1px 0 0 0 #409eff;
      border-radius: 8px;
    }
  }
  .new-file {
    width: 208px;
    height: 48px;
    font-size: 14px;
    color: #1e78f0;
    line-height: 48px;
  }
  .new-file-input {
    height: 48px;
    width: 208px;
    line-height: 48px;
    ::v-deep .el-input__inner {
      height: 48px;
    }
  }
  .button-group {
    height: 64px;
    width: 208px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: solid 1px #ccc;
    .cancel-button {
      border: 1px solid #999999;
      border-radius: 4px;
      color: #000;
    }
    .move-button {
      background: #1e78f0;
      border-radius: 4px;
      color: #fff;
    }
    .input-move-button-background {
      background: #999999;
    }
  }
}

/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 1px;
  height: 16px;
  position: absolute;
  right: 0px;
}
/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
</style>
