<template>
  <div class="comment">
    <div class="avatar-wrapper">
      <el-avatar :src="item.user.avatar"></el-avatar>
    </div>
    <div class="content-wrapper">
      <span class="username">{{ item.user.name }}</span>
      <div class="comment-content">
        {{ item.content }}
      </div>
      <div class="gallery" v-if="item.images.length > 0">
        <el-image
          v-for="(image, index) in item.images"
          :src="image.url"
          :key="index"
          style="width: 160px; height: 160px"
          fit="cover"
        ></el-image>
      </div>
      <div class="toolbar">
        <div class="btn-group">
          <span class="datetime">
            {{ $d(new Date(item.create_time), "long") }}
          </span>
          <span> | </span>
          <el-button
            v-if="!replyActive"
            @click="replyActive = true"
            class="reply-btn"
          >
            {{ $t("community.Reply") }}
          </el-button>
          <el-button v-else class="cancel-btn" @click="replyActive = false">
            {{ $t("community.Cancel") }}
          </el-button>
          <el-button
            @click="handleReplayDelete(item)"
            v-if="item.user.id == $store.getters.userInfo.user_id"
          >
            {{ $t("community.delete") }}
          </el-button>
        </div>
      </div>
      <reply-widget
        v-if="replyActive"
        :replyActive.sync="replyActive"
        @success="handleReplySuccess"
        :comment-id="item.id"
      ></reply-widget>
      <div class="reply-list">
        <reply
          v-for="reply in item.replies"
          :item="reply"
          :key="reply.id"
          @success="handleReplySuccess"
          @delete="handleReplayDelete"
        ></reply>
      </div>
    </div>
  </div>
</template>

<script>
import Reply from "@/views/community/Reply";
import ReplyWidget from "@/views/community/ReplyWidget";
export default {
  data() {
    return {
      replyActive: false,
    };
  },
  props: {
    showAvatar: {
      type: Boolean,
      defualt: true,
    },
    avatarSize: {
      type: Number,
      defaylt: 40,
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: { Reply, ReplyWidget },
  methods: {
    handleReplySuccess() {
      this.$emit("success");
    },
    handleReplayDelete(item) {
      this.$emit("delete", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.comment {
  display: flex;

  .content-wrapper {
    margin-left: 12px;
    width: 100%;
    .username {
      font-size: 14px;
      color: #1a1a1a;
    }
    .comment-content {
      margin-top: 10px;
      font-size: 14px;
      color: #333;
    }
    .toolbar {
      .el-button {
        border: none;
        background: none;
        font-size: 14px;
      }
      .datetime {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .gallery {
    margin: 12px 0px;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    .el-image {
      margin-right: 20px;
    }
  }
  .reply-widget {
    margin: 20px 0px;
  }
}
</style>
