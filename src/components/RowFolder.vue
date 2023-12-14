<template>
  <div class="container" id="container">
    <div class="plus" @click="addFolder">
      {{ $t("collection.create new collection") }}
    </div>

    <div>
      <draggable
        id="folderWrapper"
        class="folderWrapper"
        v-model="myArray"
        force-fallback="true"
        handle=".moreMenuIcons"
        @start="onStart()"
        @end="onEnd"
        :move="checkMove"
        animation="300"
      >
        <div
          class="folderContainer"
          v-for="(item, index) in myArray"
          @mouseenter="handleFolderMouseEnter"
          :key="item.id"
          @click="handleClickFolder(item)"
          :style="index == 0 ? ' visibility: hidden' : ''"
        >
          <div class="moreMenuIconsBox">
            <span
              v-show="isYourAccount && item.id !== '0'"
              @click.stop="handleRenameClick(item, index)"
              class="moreMenuIcon"
              id="moreMenuIcon"
            >
              <i class="ortur-icon-pen"></i>
            </span>
            <span
              v-show="isYourAccount && item.id !== '0'"
              class="moreMenuIcons"
              id="moreMenuIcon"
            >
              <i class="el-icon-s-fold"></i>
            </span>
          </div>
          <div class="folder">
            <div class="imgArr">
              <template v-if="item.images && item.images.length > 0">
                <div
                  class="imgArrItem"
                  v-for="subItem in item.images.slice(0, 4)"
                  :key="subItem"
                >
                  <img :src="subItem" alt="" />
                </div>
              </template>
              <div class="noImgItem" v-for="item in imgArr" :key="item" v-else>
                <div class="noImg">{{ $t("design.emptyCollection") }}</div>
              </div>
            </div>
            <el-tooltip
              effect="light"
              placement="bottom-start"
              :open-delay="1000"
              :visible-arrow="false"
            >
              <div slot="content">
                {{ item.name }}
              </div>
              <div class="title">
                <svg-icon
                  class="svgicon"
                  icon-class="收藏夹普通"
                  class-name="icon-收藏夹普通"
                ></svg-icon>
                {{ item.name }}
              </div>
            </el-tooltip>
            <div class="title">
              <svg-icon
                class="svgicon"
                icon-class="u580"
                class-name="icon-u580"
              ></svg-icon>
              {{ item.images ? item.images.length : 0 }}
            </div>
          </div>
        </div>
      </draggable>
    </div>

    <el-dialog
      :title="$t('design.Edit collections')"
      :visible.sync="renameVisible"
      :show-close="false"
      width="410px"
    >
      <div class="closeaddname" @click="closerename">
        <i class="el-icon-close"></i>
      </div>
      <el-input v-model="collectionMessage.name" maxlength="31"></el-input>
      <div class="buttonBox">
        <div class="Deletecollection" @click.stop="handleDelClick(item)">
          {{ $t("design.Delete") }}
        </div>
        <div style="display: flex; justify-content: space-between">
          <div class="closerename">
            <el-button @click="closerename">
              {{ $t("design.cancel") }}</el-button
            >
          </div>
          <el-button @click="rename">{{ $t("setting.submit") }}</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('collection.create a new collection')"
      :visible.sync="addnameVisible"
      :show-close="false"
      width="410px"
    >
      <div class="closeaddname" @click="closeaddname">
        <i class="el-icon-close"></i>
      </div>
      <el-input
        v-model="addFolderMessage.name"
        id="input1"
        maxlength="31"
      ></el-input>
      <el-button @click="addname">{{ $t("setting.submit") }}</el-button>
    </el-dialog>
    <el-dialog
      :visible.sync="addnameVisibles"
      :show-close="false"
      width="410px"
    >
      <div class="closeTis" @click="closeTis">
        <i class="el-icon-close"></i>
      </div>
      <div class="closeTisBox">
        {{ $t("design.Create up to 30 collections") }}
      </div>
      <div class="closeTisbutton">
        <el-button @click="closeTis">{{ $t("design.I know") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { renameCollection, addCollection, SortCollection } from "@/api/design";
export default {
  props: {
    imgArr: {
      type: Array,
      default: () => {
        return [
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F210F2130512J47-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663124045&t=d288c47a19560c2971d5541c585dea56",
        ];
      },
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isYourAccount: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    onFolderAdd: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newval) {
        this.myArray = newval;
        console.log(this.myArray, 88888);
      },
    },
  },
  data() {
    return {
      drag: false,
      isEdit: false,
      isRename: false,
      renameVisible: false,
      item: "",
      itemImages: "",
      collectionMessage: {
        name: "",
      },
      myArray: [],
      from: {
        after: 0,
        id: 0,
      },
      evt: "",
      addnameVisible: false,
      addnameVisibles: false,
      addFolderMessage: {
        name: "",
      },
    };
  },
  computed: {
    folders: {
      get() {
        return [...this.value];
      },
      set(val) {
        this.myArray = val;
      },
    },
  },
  mounted() {},
  methods: {
    handleClickMore(target) {
      if (target.showMoreMenu) {
        target.showMoreMenu = false;
        return;
      }
      for (const item of this.folders) {
        item.showMoreMenu = false;
      }
      target.showMoreMenu = !target.showMoreMenu;
    },
    handleFolderMouseEnter() {
      for (const item of this.folders) {
        item.showMoreMenu = false;
      }
    },
    rename() {
      renameCollection(this.collectionMessage)
        .then(() => {
          this.collectionMessage.isEdit = false;
          this.renameVisible = false;
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "Name changed successfully",
          });
        });
    },
    closerename() {
      this.renameVisible = false;
      this.$emit("getCollectList");
    },
    closeTis() {
      this.addnameVisibles = false;
    },
    handleRenameClick(item) {
      this.item = item;
      this.$emit("Rename", item);
      item.isEdit = true;
      item.showMoreMenu = false;
      this.isRename = true;
      this.renameVisible = true;
      this.collectionMessage = item;
    },
    handleDelClick(item) {
      this.$emit("delFolder", item);
      item.showMoreMenu = false;
    },
    handleClickFolder(item) {
      console.log("isItem", item.isEdit, item);
      this.$emit("clickFolder", item);
    },
    closeaddname() {
      document.getElementById("input1").value = "";
      this.addnameVisible = false;
    },
    addname() {
      addCollection(this.addFolderMessage)
        .then(() => {
          this.addFolderMessage.isEdit = false;
          this.addnameVisible = false;
        })
        .then(() => {
          this.$message({
            message: this.$t("design.addSuccess"),
            type: "success",
          });
          this.folders = this.folders.concat({
            name: this.folders.length + 1,
            id: this.folders.length + 1,
            isEdit: false,
            showMoreMenu: false,
          });
          this.isEdit = false;
          this.$emit("getCollectList");
        });
      document.getElementById("input1").value = "";
    },
    addFolder() {
      if (this.folders.length > 29) {
        this.addnameVisibles = true;
        return;
      } else {
        // this.isEdit = true;
        this.isRename = false;
        this.addnameVisible = true;
      }
    },
    checkMove(evt) {
      this.evt = evt;
      return true;
    },
    //开始拖拽事件
    onStart() {
      this.drag = true;
    },
    //拖拽结束事件
    onEnd() {
      for (let i = this.myArray.length; i > 0; i--) {
        if (i === this.evt.relatedContext.index) {
          if (i === 1) {
            this.from.after = 0;
          } else {
            this.from.after = this.myArray[i - 1].id;
          }
        }
      }
      this.from.id = this.evt.draggedContext.element.id;
      SortCollection(this.from).then(() => {
        this.$emit("getCollectList");
      });
      this.drag = false;
    },
  },
};
</script>

<style></style>
<style lang="scss" scoped>
.closeaddname {
  position: relative;
  top: -60px;
  left: 350px;
  font-size: 18px;
}
.buttonBox {
  .Deletecollection {
    color: red;
    width: 70px;
    height: 48px;
    text-align: center;
    line-height: 48px;
    border-radius: 8px;
    cursor: pointer;
  }
  display: flex;
  justify-content: space-between;
  ::v-deep .el-button {
    margin-left: 20px;
    background: #1a77e3;
    color: #fff;
  }
}
.closeTis {
  position: relative;
  top: -50px;
  left: 350px;
  font-size: 18px;
}
.closeTisBox {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
}
.closeTisbutton {
  ::v-deep .el-button {
    margin-left: 145px;
    background: #1a77e3;
    color: #fff;
  }
}
.closerename {
  ::v-deep .el-button {
    height: 48px;
    background: #ffffff;
    font-size: 14px;

    font-weight: 400;
    color: #1a1a1a;
  }
}
::v-deep ::v-deep .el-dialog {
  border-right: 10px;
}
::v-deep .el-dialog__header {
  text-align: left;
}
::v-deep .el-input {
  margin-bottom: 15px;
}
::v-deep .el-button {
  margin-left: 278px;
  background: #1a77e3;
  color: #fff;
}

.container::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  // box-shadow: inset 0 0 5px red;
  background: #ccc;
}

.container::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
.container {
  width: 400px;
  margin: 61px auto;
  display: flex;
  overflow-y: visible;
  // height: 168px;

  .plus {
    position: absolute;
    top: -1px;
    left: 866px;
    cursor: pointer;
    text-align: center;
    width: 208px;
    height: 48px;
    background: #1e78f0;
    border-radius: 8px;
    font-size: 16px;

    font-weight: 400;
    color: #ffffff;
    line-height: 48px;
  }
  .plus:hover {
    background: #cccccc;
  }

  .folderWrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .folderContainer:hover .moreMenuIcon {
      text-align: right;
      display: inline;
    }
    .folderContainer:hover .moreMenuIcons {
      text-align: right;
      display: inline;
    }

    .folderContainer {
      position: relative;
      margin-right: 42px;
      // .moreMenuIcon:hover {
      //   cursor: pointer;
      // }
      .moreMenuIcon {
        display: none;
        margin-right: 4px;
        cursor: pointer;
        text-align: center;
        text-align: right;
        padding: 0 5px;
        width: 40px;
        height: 40px;
        background: #f0f0f0;
        border-radius: 6px;
        font-size: 18px;
        position: relative;
        top: 42px;
        left: -21px;
      }
      .moreMenuIconsBox {
        text-align: right;
        height: 25px;
      }
      .moreMenuIcons {
        cursor: pointer;
        display: none;
        text-align: center;
        text-align: right;
        padding: 0 5px;
        width: 40px;
        height: 40px;
        background: #f0f0f0;
        border-radius: 6px;
        font-size: 18px;
        position: relative;
        top: 42px;
        left: -21px;
      }
      .folder {
        overflow: visible;
        display: flex;
        flex-direction: column;
        justify-content: center;
        // align-items: center;
        margin-right: 5px;
        .imgArr:hover {
          cursor: pointer;
        }
        .imgArr {
          display: flex;
          flex-wrap: wrap;
          border: 1px solid #cccccc;
          width: 328px;
          height: 248px;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          justify-content: space-between;

          .imgArrItem {
            img {
              width: 160px;
              height: 120px;
            }
          }
          .noImgItem {
            margin: auto;
            text-align: center;
            .noImg {
              width: 104px;
              height: 68px;
              line-height: 68px;
            }
          }
        }

        .editInput {
          width: 112px;
          height: 24px;
          background: #f0f3fa;
          border: 1px solid #999999;
          border-radius: 4px;
          margin-bottom: 16px;
          outline-color: #999999;
          padding: 10px;
        }
        .title {
          margin-left: 5px;
          width: 112px;
          height: 19px;
          font-size: 14px;

          font-weight: 400;
          color: #999999;
          margin-top: 8px;

          /* 1.溢出隐藏 */
          overflow: hidden;
          /* 2.用省略号来代替超出文本 */
          text-overflow: ellipsis;
          /* 3.设置盒子属性为-webkit-box  必须的 */
          display: -webkit-box;
          /* 4.-webkit-line-clamp 设置为2，表示超出2行的部分显示省略号，如果设置为3，那么就是超出3行部分显示省略号 */
          -webkit-line-clamp: 1;
          /* 5.字面意思：单词破坏：破坏英文单词的整体性，在英文单词还没有在一行完全展示时就换行  即一个单词可能会被分成两行展示 */
          word-break: break-all;
          // /* 6.盒子实现多行显示的必要条件，文字是垂直展示，即文字是多行展示的情况下使用 */
          -webkit-box-orient: vertical;
        }
      }
    }
    .folderContainer:hover .imgArr {
      background: #e8ebf4;
    }
  }
}
</style>
