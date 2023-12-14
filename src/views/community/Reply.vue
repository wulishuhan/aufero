<template>
  <div class="reply">
    <div class="avatar-wrapper">
      <el-avatar :src="item.user.avatar" :size="32"></el-avatar>
    </div>
    <div class="content-wrapper">
      <span class="username">{{ item.user.name }}</span>
      <div class="reply-content">{{ item.content }}</div>
      <div class="gallery" v-if="item.images.length > 0">
        <el-image
          v-for="(image, index) in item.images"
          :src="image.url"
          :key="index"
          style="width: 160px; height: 160px"
          fit="cover"
        ></el-image>
      </div>
      <div class="ref-content" v-if="JSON.stringify(item.refer) != '{}'">
        <span>{{ $t("community.Reply to") }}</span>
        <span class="reply-to"> @{{ item.refer.user.name }}:</span>
        <span>{{ item.refer.content }}</span>
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
            @click="handleReplayDelete"
            v-if="item.user.id == $store.getters.userInfo.user_id"
          >
            {{ $t("community.delete") }}
          </el-button>
        </div>
        <reply-widget
          v-if="replyActive"
          :replyActive.sync="replyActive"
          :comment-id="item.id"
          @success="handleReplySuccess"
        ></reply-widget>
      </div>
    </div>
  </div>
</template>

<script>
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
      default: true,
    },
    avatarSize: {
      type: Number,
      default: 40,
    },
    item: {
      type: Object,
      default() {
        return {
          id: 0,
          content: "",
          create_time: "",
          images: [],
          refer: {},
          status: 0,
          user: {
            avatar: "",
            id: 0,
            name: "",
          },
        };
      },
    },
  },
  components: { ReplyWidget },
  methods: {
    handleReplySuccess() {
      this.$emit("success");
    },
    handleReplayDelete() {
      this.$emit("delete", this.item);
    },
  },
};
</script>
<style lang="scss" scoped>
.reply {
  display: flex;

  .content-wrapper {
    width: 100%;
    margin-left: 10px;
    .username {
      font-size: 12px;
      color: #1a1a1a;
    }
    .reply-content {
      margin-top: 10px;
      font-size: 12px;
      color: #333;
    }
    .ref-content {
      margin-top: 10px;
      font-size: 12px;
      color: #999;
      background: #e8ebf4;
      border-radius: 8px;
      padding: 12px;
      .reply-to {
        color: #333;
        font-weight: 500;
        margin-right: 4px;
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
    .toolbar {
      font-size: 12px;
      .el-button {
        border: none;
        background: none;
        font-size: 12px;
      }
      .datetime {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
