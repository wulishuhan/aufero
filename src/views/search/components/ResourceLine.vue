<template>
  <div class="resource-line-wrapper">
    <div class="userinfo">
      <router-link :to="'/design/' + authorInfo.id">
        <div class="avatar"><img :src="avatar" /></div>
      </router-link>
      <div class="follow-wrapper">
        <router-link :to="'/design/' + authorInfo.id">
          <div class="username" style="color: #1a1a1a" :title="authorInfo.name">
            {{ authorInfo.name }}
          </div>
        </router-link>
        <div class="user-profile">
          <span>
            <span class="fans-num">
              {{ authorInfo.resources.length }}
            </span>
            <span>{{ $t("search.Resources") }}</span>
          </span>
          <span>
            <span class="fans-num">
              {{ authorInfo.follower_count }}
            </span>
            <span>{{ $t("search.Follows") }}</span>
          </span>
        </div>
        <div class="follow-info">
          <el-button v-if="isFollow" @click="handleUnFollow" class="follow">{{
            $t("design.unFollow")
          }}</el-button>
          <el-button v-else @click="handleFollow" class="nofollow">{{
            $t("design.follow")
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="cover-list-wrapper" v-if="authorInfo.resources.length > 0">
      <router-link
        v-for="item in authorInfo.resources.slice(0, 5)"
        :to="'/thing/' + item.id"
        :key="item.id"
      >
        <img :src="item.image" />
      </router-link>
    </div>
    <div v-if="authorInfo.resources.length <= 0" class="is-empty-resource">
      {{ $t("search.notResource") }}
    </div>
  </div>
</template>
<script>
import { follow, unFollow } from "@/api/design";
import { createNamespacedHelpers } from "vuex";
import { generatorDefaultAvator } from "@/utils/generateImage";
const { mapState } = createNamespacedHelpers("user");
export default {
  data() {
    return {};
  },
  props: {
    authorInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapState(["myFollowingList", "userInfo"]),
    isFollow() {
      this.myFollowingList;

      for (const item of this.myFollowingList) {
        if (item.id == this.authorInfo.id) {
          return true;
        }
      }
      return false;
    },
    avatar() {
      return this.authorInfo.avatar == ""
        ? generatorDefaultAvator(this.authorInfo.name, this.authorInfo.id)
        : this.authorInfo.avatar;
    },
  },
  mounted() {},
  methods: {
    handleFollow() {
      console.log(this.authorInfo);
      follow({ userId: this.authorInfo.id }).then(() => {
        this.$store.dispatch("user/getMyFollowingList", {
          userId: this.userInfo.user_id,
        });
        this.$message({
          type: "success",
          message: this.$t("design.followSuccess"),
        });
      });
    },
    handleUnFollow() {
      unFollow({ userId: this.authorInfo.id }).then(() => {
        this.$store.dispatch("user/getMyFollowingList", {
          userId: this.userInfo.user_id,
        });
        this.$message({
          type: "success",
          message: this.$t("design.unFollowSuccess"),
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.resource-line-wrapper {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  .userinfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 264px;
    height: 84px;
    background: none;
    .avatar {
      width: 74px;
      height: 74px;
      overflow: hidden;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .follow-wrapper {
      width: 150px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      margin-right: 20px;
      .username {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .user-profile {
        display: flex;
        justify-content: space-between;
        color: #ccc;
        font-size: 10px;
        .fans-num {
          color: #000010;
        }
      }
      .follow-info {
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .el-button {
          font-size: 10px;
          width: 84px;
          height: 30px;
          line-height: 30px;
          background: #1e78f0;
          color: #fff;
          border-radius: 6px;
          padding: unset;
        }
        .el-button.follow {
          background: unset;
          color: #1a1a1a;
          font-weight: 400;
          border: 1px solid #cccccc;
        }
        .el-button.follow:hover {
          color: #f3575c;
          border: 1px solid #f3575c;
        }
      }
    }
  }
  .cover-list-wrapper {
    margin-left: 40px;
    display: flex;
    align-items: center;
    img {
      width: 184px;
      height: 136px;
      object-fit: cover;
    }
    a + a {
      margin-left: 30px;
    }
  }
  .is-empty-resource {
    margin-left: 40px;
    font-size: 20px;
    color: #999999;
  }
}
</style>
