<template>
  <div class="wrapper">
    <div v-for="item in userList" :key="item.userId">
      <div class="container">
        <div class="left">
          <div class="img" @click="viewAuthorInfo(item.id)">
            <img class="img" :src="avatar(item)" alt="" />
          </div>
          <div class="center">
            <el-tooltip
              effect="light"
              placement="bottom-start"
              :open-delay="1000"
              :visible-arrow="false"
            >
              <div slot="content">
                {{ item.name }}
              </div>
              <div class="name" @click="viewAuthorInfo(item.id)">
                {{ item.name }}
              </div>
            </el-tooltip>
            <div class="titleBox">
              <div class="title" style="margin-right: 15px">
                {{ item.resource_count }} Resources
              </div>
              <div class="title">{{ item.follower_count }} Followers</div>
            </div>
            <div class="right">
              <FollowButton
                :follow="myFollowList.includes(item.id)"
                ref="followBtn"
                :userId="item.id"
                :key="item.id"
                v-show="myUserId !== item.id"
              ></FollowButton>
            </div>
          </div>
          <div v-for="(item, index) in item.resources.slice(0, 5)" :key="index">
            <div
              v-if="item.resources !== ''"
              class="tingImgBox"
              @click="toDetail(item.id)"
            >
              <img class="tingImg" :src="item.image" alt="" />
            </div>
          </div>
          <div class="text" v-if="item.resources == ''">Have no resources</div>
        </div>
      </div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
import FollowButton from "@/components/FollowButton.vue";
import { generatorDefaultAvator } from "@/utils/generateImage";
export default {
  components: {
    FollowButton,
  },
  data() {
    return {};
  },
  props: {
    myUserId: [String, Number],
    userList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    myFollowList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  mounted() {},
  methods: {
    //跳转到对应的作者主页面
    viewAuthorInfo(userId) {
      this.$router.push(`/design/${userId}`);
    },
    //跳转到对应的作品集
    toDetail(id) {
      console.log(id, 47);
      if (!this.isTouch) {
        window.open(`/thing/${id}`);
      }
      if (this.touchNum >= 2 && this.isTouch) {
        this.$router.push(`/thing/${id}`);
      }
    },
    avatar(userInfo) {
      console.log("userInfo: " + userInfo);
      return userInfo.avatar
        ? userInfo.avatar
        : generatorDefaultAvator(userInfo.name, userInfo.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: auto;
}
.container {
  width: 100%;
  padding: 16px 1px;
  text-align: left;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 138px;
}
.center {
  width: 216px;
  margin-right: 16px;
  height: 100%;
}
.name {
  cursor: pointer;
  margin-top: 12px;
  margin-bottom: 12px;
  font-size: 20px;

  font-weight: 500;
  color: #1a1a1a;
  width: 167px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.img {
  cursor: pointer;
  width: 98px;
  height: 98px;
  border-radius: 50%;
  margin-right: 31px;
}
.titleBox {
  display: flex;
  margin-bottom: 12px;
}
.title {
  font-size: 14px;

  font-weight: 400;
  color: #000010;
}
.el-divider {
  margin: 0px;
  width: 1420px;
  height: 1px;
  background: #cccccc;
}
.tingImgBox {
  background: #e8ebf4;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 27px;
  width: 184px;
  height: 136px;
  overflow: hidden;
}
.tingImg {
  width: 100%;
  height: 136px;
}
.text {
  margin-left: 31px;
  font-size: 20px;

  font-weight: 400;
  color: #999999;
}
</style>
