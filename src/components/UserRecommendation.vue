<template>
  <div class="user-card">
    <div class="user-info">
      <div class="user-info-avatar-name">
        <el-avatar
          :src="avatar"
          :size="60"
          @click.native="viewAuthorInfo(creator.id)"
        ></el-avatar>
        <!-- <span class="name" @click="viewAuthorInfo(creator.id)">{{
          creator.name
        }}</span> -->
        <el-tooltip
          effect="light"
          placement="bottom-start"
          :visible-arrow="false"
          :open-delay="1000"
        >
          <div slot="content">
            {{ creator.name }}
          </div>
          <span class="name" @click="viewAuthorInfo(creator.id)">{{
            creator.name
          }}</span>
        </el-tooltip>
      </div>
      <el-button v-if="!isFollow" @click="follow">
        {{ $t("UserRecommendation.Follow") }}
      </el-button>
      <el-button v-else @click="unFollow">
        {{ $t("UserRecommendation.Unfollow") }}
      </el-button>
    </div>
    <div class="recommend-resources">
      <el-image
        v-for="item in moreCreateList"
        :key="item.id"
        :src="item.image"
        @click="toMore(item.id)"
        :fit="'contain'"
      ></el-image>
    </div>
  </div>
</template>
<script>
import { getMoreByThisCreator } from "@/api/resource";
import { follow, unFollow } from "@/api/design";
import { generatorDefaultAvator } from "@/utils/generateImage";
import { mapState } from "vuex";
export default {
  name: "UserRecommendation",
  props: {
    creator: {
      type: Object,
      default: () => {
        return {
          avatar:
            "https://orturbucket.s3.amazonaws.com/pic/5f93f983524def3dca464469d2cf9f3e",
          id: 110,
          name: "ccc@ccc.cccq",
        };
      },
    },
    currentResourceId: {
      type: Number,
      default: 1,
    },
  },
  mounted() {
    getMoreByThisCreator({
      userId: this.creator.id,
      pageSize: 3,
      pageNum: 1,
      resId: this.currentResourceId,
    }).then((res) => {
      this.moreCreateList = res.data.rows;
    });
  },
  data() {
    return {
      moreCreateList: [],
      isLock: false,
    };
  },
  computed: {
    isFollow() {
      return this.$store.getters.myFollowingList.some((item) => {
        return item.id == this.creator.id;
      });
    },
    avatar() {
      return this.creator.avatar
        ? this.creator.avatar
        : generatorDefaultAvator(this.creator.name, this.creator.id);
    },
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    follow() {
      if (this.isLock) {
        return;
      }
      this.isLock = true;
      follow({
        userId: this.creator.id,
      })
        .then(() => {
          this.$store.commit("user/SET_FOLLOWINGLIST", [
            ...this.$store.getters.myFollowingList,
            this.creator,
          ]);
          this.isLock = false;
        })
        .catch(() => {
          this.$store.dispatch("user/getMyFollowingList", {
            userId: this.userInfo.user_id,
          });
          this.isLock = false;
        });
    },
    unFollow() {
      if (this.isLock) {
        return;
      }
      this.isLock = true;
      unFollow({
        userId: this.creator.id,
      })
        .then(() => {
          this.$store.commit(
            "user/SET_FOLLOWINGLIST",
            this.$store.getters.myFollowingList.filter((item) => {
              item.id !== this.creator.id;
            })
          );
          this.isLock = false;
        })
        .catch(() => {
          this.$store.dispatch("user/getMyFollowingList", {
            userId: this.userInfo.user_id,
          });
          this.isLock = false;
        });
    },
    toMore(id) {
      this.$router.push(`/thing/${id}`);
    },
    viewAuthorInfo(userId) {
      this.$router.push(`/design/${userId}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.user-card {
  width: 384px;
  height: 180px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(18, 18, 18, 0.07);
  border-radius: 10px;
  padding: 16px;

  font-weight: 400;
  .user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user-info-avatar-name {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      .name {
        font-size: 20px;
        margin-left: 17px;
        width: 115px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-button {
      width: 104px;
      height: 40px;
      background: #1e78f0;
      border-radius: 8px;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 400;

      font-size: 16px;
    }
  }
  .recommend-resources {
    display: grid;
    grid-template-columns: repeat(3, 98px);
    justify-content: space-between;
    margin-top: 17px;
    .el-image {
      width: 98px;
      height: 74px;
      border-radius: 5px;
      cursor: pointer;
      background-color: #e8ebf4;
    }
  }
}
</style>
