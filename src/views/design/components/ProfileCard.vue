<template>
  <div>
    <div class="imgWrap">
      <span v-if="isYourAccount" class="ortur-icon-pen imgEdit">
        <el-upload
          v-if="isYourAccount"
          class="upload-demo"
          :headers="headers"
          :on-success="handleImgUploadSuccess"
          :on-error="handleImgUploadErr"
          :before-upload="handleBeforeImgUpload"
          ref="upload"
          :action="baseURL + '/system/user/avatar'"
          :auto-upload="true"
          :show-file-list="false"
        >
          <button slot="trigger" size="small" type="primary">选取文件</button>
        </el-upload>
      </span>
      <img class="img" v-if="isYourAccount" :src="userInfo.avatar" />
      <img
        class="img"
        mode="widthFix"
        v-else
        :src="user.avatar ? user.avatar : defaultAvatar"
        alt=""
      />
    </div>
    <div class="name">
      {{ isYourAccount ? userInfo.nick_name : user.name }}
    </div>
    <!-- 他人主页的关注和取消关注按钮 -->
    <FollowButton
      class="followBtn"
      v-if="!isYourAccount"
      :user-id="userId"
      :follow="myFollowingList.includes(userId - 0)"
      @listenFollowButtonEvent="FollowButton"
    ></FollowButton>
    <div class="desc" v-if="!isDescEdit">
      {{ form.description }}
    </div>
    <div class="follow">
      <span class="followers" @click="openFollowDialog('first')"
        >{{ user.follower_count }}
        <span style="color: #ccc">{{ $t("design.follower") }}</span>
      </span>
      <span class="following" @click="openFollowDialog('second')"
        >{{ user.following_count
        }}<span style="color: #ccc"> {{ $t("design.following") }}</span>
      </span>
    </div>
    <div class="iconbutton">
      <div class="edit" @click="handleShowProfile">
        <i
          style="
            font-size: 16px;

            font-weight: 400;
          "
          class="ortur-icon-pen imgEdit"
        >
          {{ $t("design.Edit Profile") }}</i
        >
      </div>
      <div class="share">
        <i
          style="
            font-size: 16px;

            font-weight: 400;
          "
          class="el-icon-share"
        >
          {{ $t("design.Share") }}</i
        >
      </div>
    </div>
    <div>
      <div
        style="
          font-size: 16px;

          font-weight: 400;
        "
      >
        {{ $t("design.Social profiles") }}
      </div>
      <div class="icon">
        <div>
          <svg-icon icon-class="脸书" class-name="icon-脸书"></svg-icon>
        </div>
        <div>
          <svg-icon icon-class="Vector-5" class-name="icon-Vector-5"></svg-icon>
        </div>
        <div>
          <svg-icon icon-class="推特" class-name="icon-推特"></svg-icon>
        </div>
        <div>
          <svg-icon icon-class="ins2" class-name="icon-ins2"></svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FollowButton from "@/components/FollowButton.vue";
import { getProfileList } from "@/api/setting.js";
import { getFollowingList, getProfile } from "@/api/design";
export default {
  name: "ProfileCard",
  components: {
    FollowButton,
  },
  data() {
    return {
      myFollowingList: [],
      form: {},
      headers: {
        Authorization: getToken(),
      },
    };
  },
  mounted() {
    this.showPanel();
    this.isLogin && !this.isYourAccount && this.getMyFollowingList();
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    showPanel() {
      getProfileList(this.userInfo.user_id).then((response) => {
        console.log(response.data.data, 716);
        this.form = response.data.data;
      });
    },
    handleImgUploadSuccess() {
      this.$store.dispatch("user/getUserInfo").catch((e) => {
        console.log(e);
      });
      this.$message.success(this.$t("design.uploadSuccess"));
    },
    handleImgUploadErr(err) {
      //console.log(e)
      this.$message.error(this.$t("design.uploadFail") + err);
    },
    handleBeforeImgUpload(file) {
      const isJPG = file.type.includes("image");
      // const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error(this.$t("design.onlyImg"));
      }
      // if (!isLt1M) {
      //   this.$message.error("上传头像图片大小不能超过 1MB!");
      // }
      return isJPG;
    },
    FollowButton() {
      getProfile(this.userId).then((params) => {
        let res = params.data.data;
        Object.assign(this.user, res);
      });
    },
    getMyFollowingList() {
      getFollowingList({ userId: this.userInfo.user_id }).then((res) => {
        this.myFollowingList = [];
        this.myFollowingList = res.data.data.map((item) => {
          return item.id - 0;
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
