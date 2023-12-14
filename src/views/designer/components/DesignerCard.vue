<template>
  <div class="designer-card">
    <div class="designer-card-content">
      <div class="img">
        <img :src="designer.uploadImg" />
      </div>
      <div class="designer-card-info">
        <div class="avatar" @click="viewDesignerDetails(designer.id)">
          <el-avatar :size="40" :src="designer.avatar"></el-avatar>
        </div>
        <div class="designer-card-info-name">{{ designer.name }}</div>
        <div class="designer-card-info-address">{{ designer.address }}</div>
        <div>
          <div
            class="follow-box"
            :class="{ 'follow-box-border': !isFollow }"
            @click="follow"
          >
            <span v-if="!isFollow"> Follow </span>
            <span
              v-else
              :class="{ 'unfollow-box': isEnterFollowingBox }"
              @mouseover="enterFollowing"
              @mouseleave="leaveFollowing"
            >
              {{ followText }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <el-row class="card-action-item">
      <el-col :span="8">
        <div class="follower-item" @click="toFollowing(designer)">
          <div class="follower-data">{{ designer.followers }}</div>
          <div class="follower-name">Followers</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="follower-item" @click="toFollowing(designer)">
          <div class="follower-data">{{ following }}</div>
          <div class="follower-name">Following</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="follower-item" @click="viewDesignerDetails(designer.id)">
          <div class="follower-data">{{ designer.designs }}</div>
          <div class="follower-name">Designs</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { unfollowDesigner, followDesigner } from "@/api/designer";
export default {
  name: "DesignerCard",
  props: {
    designer: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.isFollow = this.designer.isFollow;
    this.following = this.designer.following;
  },
  data() {
    return {
      isFollow: false,
      isEnterFollowingBox: false,
      followText: "Following",
      following: 0,
    };
  },
  methods: {
    follow() {
      let data = {
        designerId: this.designer.id,
        userId: this.$store.getters.userId,
      };
      if (this.isFollow) {
        unfollowDesigner(data).then(() => {
          this.$message({
            message: "unfollow successfully!",
            type: "success",
          });
          this.isFollow = !this.isFollow;
          this.following = Number(this.following) - 1;
        });
      } else {
        followDesigner(data).then(() => {
          this.$message({
            message: "follow successfully",
            type: "success",
          });
          this.following = Number(this.following) + 1;
          this.isFollow = !this.isFollow;
        });
      }
    },
    enterFollowing() {
      this.followText = "Unfollow";
      this.isEnterFollowingBox = true;
    },
    leaveFollowing() {
      this.followText = "Following";
      this.isEnterFollowingBox = false;
    },
    viewDesignerDetails(id) {
      this.$router.push(`design/Designs/${id}`);
    },
    toFollowing(designer) {
      this.$router.push(`/following/${designer.id}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.designer-card {
  width: 300px;
  height: 340px;
  background-color: #fff;
  margin: 15px auto;
  text-align: center;
  .designer-card-content {
    color: #248bfb;
    width: 100%;
    height: 263px;
    .img {
      height: 110px;
      img {
        width: 100%;
      }
    }
    .designer-card-info {
      height: 135px;
      position: relative;
      top: -35px;
      text-align: center;
      .avatar {
        cursor: pointer;
      }
      .designer-card-info-name {
        font-weight: 400;
        font-size: 18px;
      }
      .designer-card-info-address {
        font-size: 12px;
      }
    }
  }
  .card-action-item {
    text-align: center;
  }
  .follower-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 76px;
    border-top: 1px solid #eee;
    border-left: 1px solid #eee;
    align-content: center;
    flex-wrap: wrap;
    cursor: pointer;
    .follower-data {
      color: #555;
      width: 100%;
      font-weight: 400;
      font-size: 18px;
      line-height: 22px;
    }
    .follower-name {
      color: #555;
      font-weight: 400;
      font-size: 12px;
    }
  }
  .el-button {
    margin-top: 20px;
  }
  .follow-box {
    width: 57px;
    height: 30px;
    margin: 5px auto;
    padding: 2px;
    cursor: pointer;
    box-sizing: border-box;
    span {
      font-size: 12px;
    }
  }
  .follow-box-border {
    border: solid 1px;
  }
  .unfollow-box {
    border: solid 1px #f33;
    padding: 4px;
    color: #f33;
  }
}
</style>
