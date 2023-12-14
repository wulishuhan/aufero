<template>
  <div class="container">
    <div class="view-wrapper">
      <community-content
        :item="item"
        :like-count.sync="item.like_count"
        :comment-count.sync="comment_count"
        :view-count.sync="item.view_count"
        :isLike.sync="item.isLike"
      ></community-content>
      <div class="comment-wrapper">
        <h3>{{ $t("community.Comments") }} {{ comment_count }}</h3>
        <reply-widget
          class="reply-widget"
          @success="handleReplySuccess"
        ></reply-widget>
        <div class="comment-list">
          <comment
            v-for="comment in commentList"
            :key="comment.id"
            :item="comment"
            @success="handleReplySuccess"
            @delete="handleReplayDelete"
          ></comment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommunityContent from "@/views/community/CommunityContent";
import ReplyWidget from "@/views/community/ReplyWidget";
import Comment from "@/views/community/Comment";
import { getCommentList } from "@/api/community";
import { getCommunityDetail, deleteComment } from "@/api/community";
import { generatorDefaultAvator } from "@/utils/generateImage";
export default {
  data() {
    return {
      item: {
        comment_count: 0,
        content: "",
        creator: {
          avatar: "",
          name: "",
          id: 0,
        },
        images: [],
        like_count: 0,
        post_time: "",
        view_count: 0,
        id: 0,
      },
      commentList: [],
    };
  },
  components: { CommunityContent, ReplyWidget, Comment },
  mounted() {
    let id = this.$route.params.id;
    getCommunityDetail(this.$route.params.id).then((res) => {
      this.item = res.data.data;
      this.item.creator.avatar =
        this.item.creator.avatar == ""
          ? generatorDefaultAvator(this.item.creator.name, this.item.creator.id)
          : this.item.creator.avatar;
    });

    getCommentList({ id: id, pageSize: 15, pageNum: 1 }).then((res) => {
      this.commentList = res.data.rows;
      this.comment_count = res.data.total;
    });
  },
  methods: {
    handleReplySuccess() {
      let id = this.$route.params.id;
      getCommentList({ id: id, pageSize: 15, pageNum: 1 }).then((res) => {
        this.commentList = res.data.rows;
        this.comment_count = res.data.total;
      });
    },
    handleReplayDelete(item) {
      deleteComment(item.id).then((res) => {
        console.log("delte!", res);
        let id = this.$route.params.id;
        getCommentList({ id: id, pageSize: 15, pageNum: 1 }).then((res) => {
          this.commentList = res.data.rows;
          this.comment_count = res.data.total;
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.view-wrapper {
  width: 1100px;
  margin: 0 auto;

  .comment-wrapper {
    margin-top: 24px;
    background: #fff;
    padding: 31px 24px;
    border-radius: 12px;
    .reply-widget {
      margin-top: 20px;
    }
    .comment-list {
      margin-top: 40px;
    }
  }
}
</style>
