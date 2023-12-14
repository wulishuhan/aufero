<!-- eslint-disable  -->
<template>
  <div>
    <Tooltip>
      <span slot="content">content</span>
      <span slot="tip">tip</span>
    </Tooltip>
    <br />
    <br />
    <el-button @click="listPlus">+</el-button>
    <div v-for="item in list" style="display: flex">
      <el-input
        style="flex: 1"
        v-model="item.text"
        v-show="item.isShow"
      ></el-input>
      <el-button style="flex: 1" @click="listDelete(item)" v-show="item.isShow">
        -
      </el-button>
    </div>
    <el-button @click="sortList">save</el-button>
    <el-button @click="collectionShow = true">open</el-button>
    <Collection
      :visiable.sync="collectionShow"
      @close="collectionShow = false"
    ></Collection>
    <div style="width: 486px">
      <el-tabs type="border-card" :stretch="true" v-model="activeName">
        <el-tab-pane label="描述" name="description">
          <show-more
            :showHeight="showHeight"
            :contentHeight="100"
            v-if="activeName == 'description'"
          >
            xxxxxxxxxxxxxxx xxxxxxxx xxxxxxxxx xxxxxx xxxxxxxxx xxxxxxx
            xxxxxxxxxxxxxx xxxxxxxxxxxxxx xxxxxxxxxxxx xxxxxxxxxx xxxxxxxxxxx
            xxxxxxxxx xxxxxxxxxxxxxx xxxxxxxxxxx xxxxxxxxxxxxxxx xxxxxxxx
            xxxxxxxxx xxxxxx xxxxxxxxx xxxxxxx xxxxxxxxxxxxxx xxxxxxxxxxxxxx
            xxxxxxxxxxxx xxxxxxxxxx xxxxxxxxxxx xxxxxxxxx xxxxxxxxxxxxxx
            xxxxxxxxxxx
          </show-more>
        </el-tab-pane>
        <el-tab-pane label="步骤" name="step">
          <show-more :showHeight="showHeight" v-if="activeName == 'step'">
            xxxxxxxxxxxxxxx xxxxxxxx xxxxxxxxx xxxxxx xxxxxxxxx xxxxxxx
            xxxxxxxxxxxxxx xxxxxxxxxxxxxx xxxxxxxxxxxx xxxxxxxxxx xxxxxxxxxxx
            xxxxxxxxx xxxxxxxxxxxxxx xxxxxxxxxxx
          </show-more>
        </el-tab-pane>
        <el-tab-pane label="制作" name="third">制作</el-tab-pane>
      </el-tabs>
    </div>
    <div></div>
    <div>
      <h1>login组件</h1>
      登录拟态框：<a href="#" @click="showDialog('login')"> login</a>
      <login
        :loadLoginDialog="isLoginForm"
        :visible.sync="dialogVisible"
        @handleClose="dialogVisible = false"
        @changeView="changeView"
      ></login>
      注册拟态框：<a href="#" @click="showDialog('register')"> register</a>
    </div>
    <h1>ResourceCard 用法:</h1>
    <ul>
      <li>
        @openCollection，回调参数：资源的id“resId”、收藏框计算后的left位置“left”、收藏框计算后的top位置“top”
      </li>
      <li>@closeCollection，回调参数：资源的id“resId”</li>
      <li>:isCollectd,传入 Boolean类型，用于确定是否已收藏</li>
      <li>:isLike,传入 Boolean类型，用于确定是否已喜欢</li>
    </ul>
    <ResourceCard
      @openCollection="openCollection"
      @closeCollection="closeCollection"
      :isCollected="false"
      :isLike="true"
    ></ResourceCard>
    <CollectedOption
      :style="collectionStyle"
      :show="openCollectedOption"
      :folders="folders"
      @close="closeCollectedOption"
      @moveFolder="moveCollectedOption"
      @addFolder="addFolder"
    ></CollectedOption>

    <div>
      <h1>CollectedOption组件</h1>
      <p>控制收藏框显示隐藏属性： show 类型:boolean</p>
      <p>传入文件夹数据属性： folders 类型:array</p>
      <p>关闭框事件： close 类型:function</p>
      <p>点击move按钮事件： moveFolder 类型:function</p>
      <p>添加文件夹事件：addFolder 类型:function</p>
    </div>
    <el-popover popper-class="user-popover" placement="bottom" trigger="click">
      <UserRecommendation></UserRecommendation>
      <el-avatar :size="40" slot="reference"></el-avatar>
    </el-popover>
    <el-popover
      placement="bottom-end"
      trigger="click"
      popper-class="popover"
      :visible-arrow="false"
    >
      <ShareSocialMedia></ShareSocialMedia>
      <div class="share-box" slot="reference">
        <i class="el-icon-share icon-share"></i>
        12345
      </div>
    </el-popover>
    <input type="file" id="upload" name="upload" @change="uploadTestFile" />
    <el-button @click="dialogVertifyEmailVisible = true">open</el-button>
    <el-dialog :visible.sync="dialogVertifyEmailVisible" :width="'500px'">
      <h2 style="text-align: center">Verify your email</h2>
      <p>
        Click the verification button in the email we sent to ttt. This helps
        keep your account secure. No email in your inbox or spam folder? Let's
        resend it. Wrong address? Log out to sign in with adifferent email. If
        you mistyped your emailwhen signing up, create a new account.
      </p>
    </el-dialog>
  </div>
</template>
<script>
import { getCommentUploadS3Url } from "@/api/user";
// import { getToken } from "@/utils/auth";
import ShareSocialMedia from "@/components/ShareCard";
import Login from "@/components/Login";
import ShowMore from "@/components/ShowMore.vue";
// import Preview from "@/components/Preview.vue";
import ResourceCard from "@/components/ResourceCard";
import CollectedOption from "@/components/CollectedOption";
import UserRecommendation from "@/components/UserRecommendation";
import Collection from "./components/Collection.vue";
import axios from "axios";
import Tooltip from "./components/ToolTip.vue";
// more module style...
// 用来预览组件
export default {
  name: "csh",
  components: {
    Collection,
    Login,
    ShowMore,
    // Preview
    ResourceCard,
    CollectedOption,
    UserRecommendation,
    ShareSocialMedia,
    Tooltip,
  },
  data() {
    return {
      collectionShow: false,
      dialogVisible: false,
      isLoginForm: true,
      isCollected: false,
      list: [
        { id: 1, text: "", isShow: false },
        { id: 2, text: "", isShow: false },
        { id: 3, text: "", isShow: false },
      ],
      test: {
        avatar: "http://dummyimage.com/300x200/f27982/FFF&text=vknro",
        id: "620000197009121720",
        isLike: false,
        likes: 737,
        publicTime: "1976 02 23",
        thingId: "620000197009121720",
        thingName: "ccdfsctohgg",
        url: "http://dummyimage.com/300x200/79a5f2/FFF&text=gxmorr",
        userId: "620000197009121720",
        userName: "gcxzxpbyne",
      },
      options: [
        {
          value: "popular",
          label: "The popular",
        },
        {
          value: "newest",
          label: "The newest",
        },
        {
          value: "folowing",
          label: "Only folowing",
        },
      ],
      value: "",
      activeName: "step",
      showHeight: 100,
      contentHeight: 0,
      urls: [
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
        "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
        "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
        "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
        "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
      ],
      swiperOptions: {
        direction: "vertical",
        mousewheel: true,
        slidesPerView: 4,
        spaceBetween: 16,
        navigation: {
          nextEl: ".down",
          prevEl: ".up",
        },
        scrollbar: {
          el: ".swiper-scrollbar",
        },
        on: {
          slideChange: function () {
            console.log("改变了，activeIndex为" + this.activeIndex);
          },
          click: function () {
            console.log("activeIndex为" + this.activeIndex);
          },
        },
      },
      openCollectedOption: false,
      folders: [
        {
          name: "aa",
          id: 1,
        },
        {
          name: "bb",
          id: 2,
        },
        {
          name: "cc",
          id: 3,
        },
      ],
      visible: false,
      showCollectionDeleteButton: false,
      collectionStyle: {
        position: "absolute",
        left: "0px",
        top: "0px",
      },
      dialogVertifyEmailVisible: false,
    };
  },
  methods: {
    listPlus() {
      for (const item of this.list) {
        if (item.isShow == false) {
          item.isShow = true;
          break;
        }
      }
    },
    listDelete(item) {
      item.isShow = false;
      item.text = "";
      for (let i = 0; i < this.list.length; i++) {
        const element = this.list[i];
        if (element.id == item.id) {
          this.list.splice(i, 1);
          break;
        }
      }
      this.list.push(item);
    },
    sortList() {
      for (let i = 0; i < this.list.length; i++) {
        for (let j = i + 1; j < this.list.length; j++) {
          if (this.list[i].id > this.list[j].id) {
            let temp = this.list[i];
            this.list[i] = this.list[j];
            this.list[j] = temp;
          }
        }
      }
      this.list = [...this.list];
    },
    uploadTestFile(event) {
      this.getS3Url(event.target.files[0]);
    },
    getS3Url(file) {
      getCommentUploadS3Url({
        name: file.name,
        size: file.size,
        type: file.type,
      })
        .then((res) => {
          console.log("preSingedUrl", res);
          return axios.put(res.data.data.presignUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
            onUploadProgress: function (progressEvent) {
              // 处理原生进度事件
              console.log(
                "Upload",
                (progressEvent.loaded / progressEvent.total) * 100 + "%"
              );
            },
          });
        })
        .then((res) => {
          console.log("put", res);
        });
    },
    prev() {
      this.$refs.nop.prev();
    },
    next() {
      this.$refs.nop.next();
    },
    imgIndex(index) {
      console.log(index);
    },
    showDialog(view) {
      if (view === "login") {
        this.isLoginForm = true;
      } else {
        this.isLoginForm = false;
      }
      this.dialogVisible = true;
    },
    changeView(view) {
      if (view === "login") {
        this.isLoginForm = true;
      } else {
        this.isLoginForm = false;
      }
    },
    closeCollectedOption() {
      this.openCollectedOption = false;
      this.isCollected = false;
    },
    moveCollectedOption(directionObject) {
      console.log("拿到选择的文件名", directionObject);
      this.openCollectedOption = false;
      this.isCollected = true;
    },
    addFolder(folderName) {
      console.log("拿到新建的文件名", folderName);
      // 加入组件渲染的文件夹数组之中
      this.folders.push({ name: folderName });
    },
    open() {
      console.log("open", arguments);
    },
    close() {
      console.log("close", arguments);
    },
    change() {
      console.log("change", arguments);
    },
    openCollection(id, left, top) {
      this.openCollectedOption = true;
      this.collectionStyle.left = left + 49 + "px";
      if (top - 240 >= 0) {
        this.collectionStyle.top = top - 240 + "px";
      } else {
        this.collectionStyle.top = top + 180 + "px";
      }
    },
    closeCollection() {
      console.log("closeCollection");
      this.isCollected = false;
    },
    handleShowNotice() {
      this.$refs.NoticePanel.showPanel();
    },
  },
  mounted() {
    axios
      .get(
        `https://orturbucket.s3.amazonaws.com/assets/2022/08/10/c4d93a3805b3ce3f323f7974e6f78jpeg_20220810181854A025.jpeg`,
        {
          responseType: "blob",
          method: "get",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        // saveAs(res.data, this.file.name);
        // this.downloadNum += 1;
        console.log(res);
      });
  },
};
</script>
<style lang="scss" scoped>
.icon-collect-box {
  width: 42px;
  height: 30px;
  background: rgba(30, 120, 240, 0.3);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* position: absolute;
  bottom: 12px;
  right: 12px; */
  cursor: pointer;
}
.icon-collect {
  font-size: 20px;
  color: #fff;
}
.icon-collect-box:hover {
  background: rgba(30, 120, 240, 0.3);
}
.swiper-container {
  width: 184px;
  height: 496px;
  .swiper-wrapper {
    height: 496px;
    width: 184px;
    .swiper-slide {
      width: 184px;
      img {
        height: 112px;
        width: 100%;
      }
    }
  }
  .up {
    z-index: 15;
    position: absolute;
    top: 0px;
    text-align: center;
    width: 100%;
    height: 24px;
    background: #1a1a1a;
    opacity: 0.3;
    border-radius: 10px 10px 0px 0px;
    i {
      color: #fff;
      opacity: 1;
      font-size: 16px;
    }
  }
  .down {
    z-index: 15;
    position: absolute;
    border-radius: 0px 0px 10px 10px;
    bottom: 0px;
    text-align: center;
    width: 100%;
    height: 24px;
    background: #1a1a1a;
    opacity: 0.3;
    i {
      color: #fff;
      opacity: 1;
      font-size: 16px;
    }
  }
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #fff;
  background-color: #f5f5f5;
  border-right-color: #f5f5f5;
  border-left-color: #f5f5f5;
  width: 120px;
  height: 40px;
  background: #1e78f0;
  border-radius: 8px;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border: none;
}
::v-deep .el-tabs--border-card {
  background: #f5f5f5;
  border: none;
}
.tab-items {
  background: none;
  width: 100%;
  height: 40px;
  font-size: 16px;

  font-weight: 400;
  text-align: center;
  line-height: 40px;
}
.btn-div {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 605px;
  height: 372px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
}
.btn {
  width: 138px;
  height: 36px;
  background: #1a1a1a;
  opacity: 0.3;
  border-radius: 6px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-up {
  margin-top: 12px;
}
.btn-down {
  margin-bottom: 12px;
}
.btn-enlarge {
  width: 36px;
  height: 36px;
  background: #1a1a1a;
  opacity: 0.3;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .el-popover {
  min-width: none;
  padding: 0px;
}
</style>
