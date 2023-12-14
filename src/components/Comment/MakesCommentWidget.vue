<template>
  <div style="width: 94%" class="comment-wrapper">
    <!-- <div v-if="!commentListFromId.rows">{{ $t("comment.empty") }}</div> -->
    <!-- <div v-else class="comment-count">
      {{ $t("comment.replyNum", [commentListFromId.rows.length]) }}
    </div> -->
    <div class="makesBox" v-if="!this.makesInfo.is_deleted">
      <div class="makesImg">
        <img style="width: 100%; height: 100%" :src="makesInfo.image" />
      </div>
      <div class="makes">
        <div
          v-if="makesInfo.isDesignShow"
          class="makesTitle"
          @click="toThing(makesInfo.id)"
        >
          <el-tooltip effect="light" placement="bottom">
            <div slot="content">
              {{ makesInfo.title }}
            </div>
            <span class="nicktitle">
              {{ makesInfo.title }}
            </span>
          </el-tooltip>
        </div>
        <div v-else class="makesTitle">
          <el-tooltip
            effect="light"
            placement="bottom-start"
            :visible-arrow="false"
            :open-delay="1000"
          >
            <div slot="content">
              {{ makesInfo.title }}
            </div>
            <span class="nicktitle">
              {{ makesInfo.title }}
            </span>
          </el-tooltip>
        </div>
        <div class="makesName" @click="toDesign(makesInfo.creator.id)">
          <el-tooltip
            effect="light"
            placement="bottom-start"
            :visible-arrow="false"
            :open-delay="1000"
          >
            <div slot="content">
              {{ makesInfo.creator.name }}
            </div>
            <span class="nickname"> By {{ makesInfo.creator.name }} </span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="invalid-resource" v-else>
      <svg-icon
        class="svg"
        icon-class="invalid"
        class-name="invalid-icon"
      ></svg-icon>
      <span class="text"> Resource has expired </span>
    </div>
    <!-- makes作者等资料 -->
    <div class="userinfo-wrapper">
      <div class="profile">
        <span class="user-avatar" @click="viewAuthorInfo(make.user.id)">
          <img :src="make.user.avatar" />
        </span>
        <el-tooltip
          effect="light"
          placement="bottom-start"
          :visible-arrow="false"
          :open-delay="1000"
        >
          <div slot="content">
            {{ make.user.name }}
          </div>
          <span class="nickname">
            {{ make.user.name }}
          </span>
        </el-tooltip>
        <span class="release-date">
          {{ $d(new Date(make.create_time), "long") }}
        </span>
      </div>
      <div
        v-show="!make.resource.is_deleted"
        class="message-btn"
        @click="showCommentInnerDialog()"
      >
        <el-button><i class="ortur-icon-message"></i></el-button>
      </div>
    </div>
    <div class="comment">{{ make.content }}</div>
    <div class="reply-list">
      <div v-for="(replyRow, id) in commentListFromId.rows" :key="id">
        <div class="userinfo-wrapper">
          <div class="profile">
            <span class="user-avatar" @click="viewAuthorInfo(replyRow.user.id)">
              <img :src="replyRow.user.avatar" />
            </span>
            <!-- <span class="nickname">{{ replyRow.user.name }}</span> -->
            <el-tooltip
              effect="light"
              placement="bottom-start"
              :open-delay="1000"
              :visible-arrow="false"
            >
              <div slot="content">
                {{ replyRow.user.name }}
              </div>
              <span class="nickname">
                {{ replyRow.user.name }}
              </span>
            </el-tooltip>
            <span class="release-date">
              {{ $d(new Date(replyRow.create_time), "long") }}
            </span>
          </div>
          <div
            v-show="!make.resource.is_deleted"
            class="message-btn"
            @click="showReplyInnerDialog(id)"
          >
            <el-button><i class="ortur-icon-message"></i></el-button>
          </div>
        </div>
        <div class="reply-wrapper">
          <div class="comment-detail">
            <div v-if="replyRow.image">
              <el-image
                :src="replyRow.image"
                :preview-src-list="[replyRow.image]"
              ></el-image>
            </div>
            {{ replyRow.content }}
          </div>
          <div
            class="reply-ref-detail"
            v-if="JSON.stringify(replyRow.refer) != '{}'"
          >
            <span class="reply-label">回复</span>
            &nbsp;
            <span class="reply-nickname">{{
              "@" + replyRow.refer.user.name
            }}</span>
            &nbsp;
            <span class="reply-comment">{{ replyRow.refer.content }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="replyTo"
      :visible.sync="innerVisible"
      top="35vh"
      append-to-body
    >
      <reply-widget
        @closeReplyModal="handleClose('inner')"
        :comment-id="currentCommentId"
        :resId="make.id"
        :primaryCommentId="make.id"
      ></reply-widget>
    </el-dialog>
  </div>
</template>

<script>
import ReplyWidget from "@/components/Comment/ReplyWidget.vue";
// import CommentContent from "@/components/Comment/CommentContent.vue";
import { mapGetters, mapState } from "vuex";
import { generatorDefaultAvator } from "@/utils/generateImage";

export default {
  props: {
    makesInfo: {
      type: Object,
      default: () => {
        return {};
      },
      required: true,
    },
    make: {
      type: Object,
      default: () => {
        return {};
      },
      required: true,
    },
  },
  computed: {
    ...mapGetters(["isLogin"]),
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      commentListFromId: (state) => state.comment.commentListFromId,
    }),
  },
  data() {
    return {
      outerVisible: false,
      innerVisible: false,
      replyListDialog: false,
      currentComment: {
        id: 0,
        content: "",
        create_time: "1990-01-01",
        user: {
          id: 0,
          avatar: "",
          name: "UNKNOW",
        },
        replies: [],
      },
      currentCommentId: 0,
      replyTo: "reply to xxxx",
      currentResId: 0,
      keywords: "",
      select: "",
      comment: {},
    };
  },
  components: {
    // CommentContent,
    ReplyWidget,
  },
  mounted() {
    this.comment = this.make;
    if (!this.comment.user.avatar) {
      this.comment.user.avatar = generatorDefaultAvator(
        this.comment.user.name,
        this.comment.user.id
      );
    }
    this.$store.dispatch("comment/getCommentListFromId", this.make.id);
  },
  methods: {
    handleClose(space) {
      if (space == "inner") {
        this.innerVisible = false;
      } else {
        this.outerVisible = false;
      }
    },
    showCommentInnerDialog() {
      if (!this.isLogin) {
        this.showLoginDialog();
        this.$emit("closeAll");
        return;
      }
      this.innerVisible = true;
      this.replyTo =
        this.$t("community.Reply to") + " " + this.comment.user.name;
      this.currentCommentId = this.comment.id;
    },
    showReplyInnerDialog(replyIndex) {
      console.log("inner dialog with", typeof replyIndex, replyIndex);
      this.innerVisible = true;
      console.log("inner dialog", this.innerVisible);
      this.replyTo =
        this.$t("community.Reply to") +
        " " +
        this.commentListFromId.rows[replyIndex].user.name;
      this.currentCommentId = this.commentListFromId.rows[replyIndex].id;
    },
    showLoginDialog() {
      let payload = { loginDialogVisible: true, isLoginForm: true };
      this.$store.dispatch("user/switchLoginRegisteForm", payload);
    },
    viewAuthorInfo(userId) {
      this.$router.push(`/design/${userId}`);
    },
    toDesign(id) {
      console.log(id, 224);
      this.$router.push(`/design/${id}`);
    },
    toThing(id) {
      console.log(id, 224);
      this.$router.push(`/thing/${id}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.comment-wrapper {
  margin: 20px 0 20px 25px;
  word-wrap: break-word;

  font-weight: 400;
  .no-img-file {
    width: 88px;
    height: 66px;
    margin-right: 10px;
    background: #e8ebf4;
    color: #c2c4cc;
    text-align: center;
    line-height: 80px;
    .file {
      width: 22px;
      height: 28px;
    }
  }
  .makesBox {
    margin-bottom: 17px;
    display: flex;
    width: 648px;
    height: 87px;
    background: #e8ebf4;
    border-radius: 8px;
    .makesImg {
      width: 83px;
      height: 55px;
      margin: auto 16px;
    }
    .makes {
      height: 55px;
      margin: auto 7px;
      .makesTitle {
        margin-top: 5px;
        font-size: 16px;

        font-weight: 400;
        color: #1a1a1a;
        max-width: 170px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .makesName {
        margin-top: 9px;
        font-size: 14px;

        font-weight: 400;
        color: #999999;
        max-width: 170px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
    }
  }

  .userinfo-wrapper {
    display: flex;
    justify-content: space-between;
    align-content: center;
    font-size: 14px;
    .profile {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        margin-right: 14px;
      }
      .user-avatar {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;

        img {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      .user-avatar:hover {
        cursor: pointer;
      }
      .nickname {
        font-size: 16px;
        font-weight: 500;
        max-width: 170px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #1a1a1a;
      }
      .release-date {
        color: #999;
        font-size: 14px;
      }
    }
    .message-btn {
      .el-button {
        border: none;
        background: none;
      }
    }
  }
  .reply-wrapper {
    padding: 5px 10px;
    margin-left: 52px;
    /* background: #e8ebf4; */
    border-radius: 8px;
    font-size: 14px;
    .comment-detail {
      margin: 10px auto;
      font-size: 16px;
      font-weight: 400;
      color: #1a1a1a;
    }
    .reply-ref-detail {
      font-size: 16px;
      color: #1a1a1a;
      background: #dadde6;
      border-radius: 8px;
      padding: 10px 20px;
      .reply-label {
        color: #999;
      }
      .reply-nickname {
        color: #1e78f0;
      }
    }
    .reply-list-fold {
      color: #1e78f0;
      background: none;
      border: none;
      width: 104px;
      height: 40px;
      .reply-label {
        color: #1e78f0;
      }
    }
    .reply-item {
      padding: 5px 10px;
      position: relative;
      .reply-detail {
        margin: 0px 54px;
        font-size: 16px;
        font-weight: 400;
        color: #1a1a1a;
      }
    }
  }
  .comment {
    width: 95%;
    color: #1a1a1a;
    margin-left: 50px;
    font-size: 14px;
  }

  .reply-list {
    width: 95%;
    margin: 20px auto;
    padding: 0px 20px;
    border-left: 2px solid #e6e6e6;
  }
}
.el-dialog__wrapper {
  background: rgba(0, 0, 0, 0.5);
}
.comment-count {
  color: #999;
  margin-bottom: 30px;
}
.makes-reply-left-line {
  width: 1px;
  height: 101px;
  border-left: 1px solid #ccc;
  position: absolute;
  left: -52px;
  top: -4px;
}
::v-deep .el-image {
  width: 184px;
  height: 112px;
}
::v-deep .el-image__inner {
  width: 184px;
  height: auto;
}
.invalid-resource {
  margin-bottom: 17px;
  display: flex;
  width: 648px;
  height: 87px;
  background: #e8ebf4;
  border-radius: 8px;
  .svg {
    font-size: 47px;
    width: 83px;
    height: 55px;
    margin: auto 16px;
  }
  .text {
    font-size: 18px;
    line-height: 87px;
  }
}
</style>
