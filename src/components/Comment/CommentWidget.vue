<template>
  <div class="comment-wrapper">
    <div v-if="commentList.length == 0">{{ $t("comment.empty") }}</div>
    <div
      v-for="(commentItem, commentIndex) in commentList"
      :key="commentItem.id"
    >
      <comment-content
        :comment="commentItem"
        :showReplyDialog="showReplyOuterDialog"
        :commentIndex="commentIndex"
      ></comment-content>
      <div class="reply-wrapper" v-if="commentItem.replies.length > 0">
        <div
          class="reply-item"
          v-for="(replyItem, replyIndex) in commentItem.replies.slice(0, 3)"
          :key="replyIndex"
        >
          <comment-content
            :comment="replyItem"
            :showReplyDialog="showReplyOuterDialogFromReply"
            :commentIndex="commentIndex"
            :replyIndex="replyIndex"
          ></comment-content>
        </div>
        <el-button
          @click="showReplyList(commentIndex, commentItem.id)"
          class="reply-list-fold"
          v-if="commentItem.comment_count > 3"
        >
          <span style="font-size: 12px">View all replies </span>
          <span style="margin-right: 6px; color: #999">{{
            commentItem.comment_count
          }}</span>
          <i class="el-icon-right" style="color: #999"></i>
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="replyTotalRows"
      :visible.sync="replyListDialog"
      destroy-on-close
      width="900px"
    >
      <div class="userinfo-wrapper">
        <div class="profile">
          <span class="user-avatar">
            <img :src="currentComment.user.avatar" />
          </span>
          <span class="nickname">
            {{ currentComment.user.name }}
          </span>
          <span class="release-date">
            {{ $d(new Date(currentComment.create_time), "long") }}
          </span>
        </div>
        <div class="message-btn" @click="showCommentInnerDialog()">
          <el-button><i class="ortur-icon-message"></i></el-button>
        </div>
      </div>
      <div class="comment">{{ currentComment.content }}</div>
      <div class="reply-list">
        <div v-for="(replyRow, id) in commentListFromId.rows" :key="id">
          <div class="userinfo-wrapper">
            <div class="profile">
              <span class="user-avatar"
                ><img :src="replyRow.user.avatar"
              /></span>
              <span class="nickname">{{ replyRow.user.name }}</span>
              <span class="release-date">
                {{ $d(new Date(replyRow.create_time), "long") }}
              </span>
            </div>
            <div class="message-btn" @click="showReplyInnerDialog(id)">
              <el-button><i class="ortur-icon-message"></i></el-button>
            </div>
          </div>
          <div class="reply-wrapper-view-all">
            <div class="comment-detail">{{ replyRow.content }}</div>
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
        append-to-body
        destroy-on-close
        top="35vh"
      >
        <reply-widget
          @closeReplyModal="handleClose('inner')"
          :comment-id="currentCommentId"
          :primary-comment-id="currentComment.id"
        ></reply-widget>
      </el-dialog>
    </el-dialog>

    <el-dialog :title="replyTo" :visible.sync="outerVisible" destroy-on-close>
      <reply-widget
        @closeReplyModal="handleClose('outer')"
        :comment-id="currentCommentId"
        :primary-comment-id="currentComment.id"
      ></reply-widget>
    </el-dialog>
  </div>
</template>

<script>
import ReplyWidget from "@/components/Comment/ReplyWidget.vue";
import CommentContent from "@/components/Comment/CommentContent.vue";
import { createNamespacedHelpers } from "vuex";
import { debounce } from "@/utils/common";
const { mapState } = createNamespacedHelpers("comment");
export default {
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
      total: 0,
      pageNum: 1,
      pageSize: 12,
    };
  },
  components: {
    CommentContent,
    ReplyWidget,
  },
  mounted() {
    let resId = parseInt(this.$route.params.thingId);
    window.removeEventListener("scroll", this._debounce);
    this._debounce = debounce(this.handleScroll, 1000);
    window.addEventListener("scroll", this._debounce);
    this.$store
      .dispatch("comment/getCommentList", {
        resId: resId,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      })
      .then((res) => {
        this.total = res.total;
      });
  },
  computed: {
    ...mapState(["commentList", "commentListFromId"]),
    replyTotalRows() {
      // eslint-disable-next-line
      var total = !!this.commentListFromId.total
        ? this.commentListFromId.total
        : 0;
      return this.$t("comment.replyNum", [total]);
    },
  },
  methods: {
    handleScroll() {
      console.log("滚动");
      var totalPage = Math.ceil(this.total / this.pageSize);
      if (this.pageNum >= totalPage) {
        window.removeEventListener("scroll", this._debounce);
        return;
      }
      var scrollTop = parseInt(
        document.documentElement.scrollTop || document.body.scrollTop
      );
      var rollupHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (rollupHeight - scrollTop <= 20) {
        let resId = parseInt(this.$route.params.thingId);
        this.$store
          .dispatch("comment/loadPageCommentList", {
            resId: resId,
            pageSize: this.pageSize,
            pageNum: ++this.pageNum,
          })
          .then((res) => {
            this.total = res.total;
          });
      }
    },
    handleClose(space) {
      if (space == "inner") {
        this.innerVisible = false;
      } else {
        this.outerVisible = false;
      }
    },
    showReplyOuterDialog(index) {
      this.outerVisible = true;
      this.currentComment = this.commentList[index];
      this.currentCommentId = this.currentComment.id;
      this.replyTo =
        this.$t("community.Reply to") + " " + this.currentComment.user.name;
    },
    showReplyOuterDialogFromReply(commentIndex, replyIndex) {
      this.outerVisible = true;
      this.currentComment = this.commentList[commentIndex];
      console.log("replyIndex:" + replyIndex);

      this.currentCommentId =
        this.commentList[commentIndex].replies[replyIndex].id;
      this.replyTo =
        this.$t("community.Reply to") + " " + this.currentComment.user.name;
    },
    showCommentInnerDialog() {
      this.innerVisible = true;
      this.replyTo =
        this.$t("community.Reply to") + " " + this.currentComment.user.name;
      this.currentCommentId = this.currentComment.id;
    },
    showReplyInnerDialog(replyIndex) {
      this.innerVisible = true;
      this.replyTo =
        this.$t("community.Reply to") +
        " " +
        this.currentComment.replies[replyIndex].user.name;
      this.currentCommentId = this.currentComment.replies[replyIndex].id;
    },
    showReplyList(index, id) {
      this.replyListDialog = true;
      this.currentComment = this.commentList[index];
      this.$store.dispatch("comment/getCommentListFromId", id);
    },
  },
};
</script>
<style lang="scss" scoped>
.comment-wrapper {
  width: 80%;
  margin: 20px auto;
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
      .nickname {
        font-size: 16px;
        font-weight: 500;
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
    background: #e8ebf4;
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
      .reply-detail {
        margin: 0px 54px;
        font-size: 16px;
        font-weight: 400;
        color: #1a1a1a;
      }
    }
  }
  .reply-wrapper-view-all {
    padding: 5px 10px;
    margin-left: 52px;
    background: none;
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
</style>
