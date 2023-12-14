<template>
  <div class="container">
    <div class="content">
      <el-row>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <el-row>
            <el-col :xs="24" :sm="12" :md="24" :lg="24" :xl="24">
              <div class="profile-card">
                <el-image
                  class="background-image"
                  :src="userInfo.background"
                ></el-image>
                <el-image class="avatar" :src="userInfo.avatar"></el-image>
                <div class="info-content">
                  <h3>{{ userInfo.name }}</h3>
                  <div class="justify-info">
                    <span>
                      <i class="el-icon-user-solid"></i>
                      <span>{{ userInfo.username }}</span>
                    </span>
                    <span>
                      <i class="el-icon-location"></i>
                      <span>{{ userInfo.address }}</span>
                    </span>
                  </div>
                  <div class="button-content">
                    <follow-button :follow="userInfo.isFollow"></follow-button>
                    <el-button type="primary">TIP DESIGNER</el-button>
                  </div>
                  <div class="bottom-content">
                    <div class="bottom-content-justify">
                      <span>{{ userInfo.followers }}</span>
                      <span>FOLLOWERS</span>
                    </div>
                    <div class="bottom-content-justify">
                      <span>{{ userInfo.following }}</span>
                      <span>FOLLOWING</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="24" :lg="24" :xl="24">
              <div class="box-container">
                <div class="box-outer-justify">
                  <div class="box" @click="to('Designs')">
                    <span>{{ userInfo.designs }}</span>
                    <span>DESIGNS</span>
                  </div>
                  <div class="box" @click="to('Makes')">
                    <span>{{ makesLength }}</span>
                    <span>MAKES</span>
                  </div>
                </div>
                <div class="box-outer-justify">
                  <div class="box" @click="to('Collections')">
                    <span>{{ collectionsLength }}</span>
                    <span>COLLECTIONS</span>
                  </div>
                  <div class="box" @click="to('Likes')">
                    <span>{{ likesLength }}</span>
                    <span>LIKES</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

          <div class="message-content">
            <el-button type="primary" @click="toMessage">MESSAGE ME</el-button>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <div>
            <div class="router-container">
              <el-button
                @click="to('Designs')"
                class="router-link"
                size="medium"
                type="text"
              >
                ABOUT
              </el-button>
              <el-button
                @click="to('Designs')"
                class="router-link"
                size="medium"
                type="text"
              >
                DESIGNS
              </el-button>
              <el-button
                @click="to('Collections')"
                class="router-link"
                size="medium"
                type="text"
              >
                COLLECTIONS
              </el-button>
              <el-button
                @click="to('Makes')"
                class="router-link"
                size="medium"
                type="text"
              >
                MAKES
              </el-button>
              <el-button
                @click="to('Likes')"
                class="router-link"
                size="medium"
                type="text"
              >
                LIKES
              </el-button>
            </div>
            <el-row>
              <el-col
                :xs="24"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12"
                v-for="item in followers"
                :key="item.userId"
              >
                <designer-card :follow="item"></designer-card>
              </el-col>
              <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { throttle } from "@/utils/cache.js";
import DesignerCard from "./components/DesignerCard";
import FollowButton from "@/components/FollowButton";
import { findFollowsByUserId, getUserInfoByUserId } from "@/api/user";
export default {
  // eslint-disable-next-line
  name: "Following",
  components: { DesignerCard, FollowButton },
  mounted() {
    findFollowsByUserId({
      userId: this.$route.params.userId,
      ...this.pagination,
    }).then((res) => {
      this.followers = res.data.data.data;
    });
    getUserInfoByUserId({
      userId: this.$route.params.userId,
    }).then((res) => {
      this.userInfo = res.data.data;
      this.makesLength = this.userInfo.makes.length;
      this.collectionsLength = this.userInfo.collections.length;
      this.likesLength = this.userInfo.likes.length;
    });
    this.load = throttle(() => {
      // 距离底部200px时加载一次
      let bottomOfWindow =
        document.documentElement.offsetHeight -
          document.documentElement.scrollTop -
          window.innerHeight <=
        200;
      if (bottomOfWindow && !this.loading && !this.noMore) {
        this.pagination.currentPage++;
        findFollowsByUserId({
          userId: this.$route.params.userId,
          ...this.pagination,
        })
          .then((res) => {
            console.log(res);
            this.followers.push(res.data.data.data);
            this.loading = false;
          })
          .catch((err) => {
            console.error(err);
            this.loading = false;
            this.noMore = true;
          });
      }
    }, 1500);
    window.addEventListener("scroll", this.load);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.load);
  },
  data() {
    return {
      followers: [],
      userInfo: {},
      makesLength: 0,
      collectionsLength: 0,
      pagination: {
        currentPage: 1,
        pageSize: 10,
      },
      likesLength: 0,
      loading: false,
      noMore: false,
      load: () => {},
    };
  },
  methods: {
    to(name) {
      this.$store.commit("filterCard/SET_SELECTPROFILE", name);
      this.$router.push(`/design/${name}/${this.$route.params.userId}`);
    },
    toMessage() {
      this.$router.push(
        `/message/${this.userInfo.name}/${this.$route.params.userId}`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #ececec;
  .profile-card {
    width: 296px;
    background-color: #fff;
    text-align: center;
    box-sizing: border-box;
    .el-button {
      width: 150px;
    }
  }
  .background-image {
    width: 296px;
    height: 146px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #fff;
    border: 4px solid #fff;
    position: relative;
    top: -65px;
  }
  .justify-info {
    margin-top: -15px;
    display: flex;
    justify-content: space-around;
  }
  .info-content {
    margin-top: -80px;
  }
  .button-content {
    margin-top: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ccc;
    .el-button {
      margin-top: 5px;
    }
  }
  .bottom-content {
    display: flex;
    justify-content: space-around;
    padding: 5px 0;
    .bottom-content-justify {
      display: flex;
      flex-direction: column;
    }
  }
  .router-link {
    text-decoration: none;
    color: #666;
  }
  .router-container {
    display: flex;
    justify-content: space-around;
    margin: 10px 0;
  }
}
.content {
  width: 970px;
  margin: 0 auto;
  position: relative;
  top: 15px;
}
.box-container {
  width: 296px;
  height: 260px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  margin-top: 15px;
  .box-outer-justify {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .box {
    width: 140px;
    height: 125px;
    background-color: #fff;
    font-size: 18px;
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    color: #666;
  }
  .box:hover {
    color: #248bfb;
    cursor: pointer;
  }
}
.message-content {
  width: 296px;
  margin-top: 15px;
  .el-button {
    width: 296px;
    height: 50px;
  }
}
@media screen and (max-width: 768px) {
  .content {
    width: 100%;
  }
}
</style>
