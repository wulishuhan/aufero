<template>
  <div class="reply-widget">
    <div class="comment-pic">
      <div class="pic-wrapper" v-for="(image, index) in images" :key="index">
        <img :src="image.url" />
        <span
          class="ortur-icon-minus remove-handle"
          @click="handleRemovePic(index)"
          style="cursor: pointer"
        >
          <span class="path1"></span>
          <span class="path2"></span>
        </span>
      </div>
    </div>
    <div class="post-content-wrapper">
      <img v-if="showAvatar" :src="userInfo.avatar" />
      <editor-content :editor="editor" class="post-content"></editor-content>
    </div>
    <div class="toolbar">
      <el-upload
        :action="baseApi + '/library/community/comment/upload'"
        :show-file-list="false"
        :on-success="upSuccess"
        :headers="headers"
        :accept="acceptType"
        :before-upload="beforeUpload"
        ref="uploadFile"
        :disabled="!isLogin"
        @click.native="checkLogin($event)"
      >
        <span class="words-count">{{ wordsCount }}/{{ wordsCountLimit }}</span>
        <el-button class="btn-uppic" style="margin-right: 18px">
          <i class="ortur-icon-image-add"></i>
        </el-button>
      </el-upload>
      <el-popover
        placement="bottom"
        width="400"
        trigger="click"
        v-model="isShowEmoji"
      >
        <VEmojiPicker @select="selectEmoji" />
        <el-button class="btn-emoji" slot="reference"
          ><i class="ortur-icon-simle"></i
        ></el-button>
      </el-popover>
      <el-button class="el-btn-post" @click="handlePost()">
        {{ $t("community.Post") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { postComment } from "@/api/community";
import { mapState } from "vuex";
import { Editor, EditorContent } from "@tiptap/vue-2";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
export default {
  data() {
    return {
      editor: null,
      showAvatar: true,
      comment: "",
      commentPic: "",
      images: [],
      acceptType: ".jpg,.png,.jpeg",
      isShowEmoji: false,
      wordsCountLimit: 2000,
      wordsCount: 0,
    };
  },
  props: {
    commentId: {
      type: Number,
      default: 0,
    },
    primaryCommentId: {
      type: Number,
      default: 0,
    },
    resId: {
      type: Number,
      default: 0,
    },
    messageId: {
      type: Number,
      default: 0,
    },
    replyActive: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.editor = new Editor({
      content: this.comment,
      autofocus: false,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: this.$t("community.Add a comment"),
          showOnlyWhenEditable: false,
        }),
      ],
      onUpdate: () => {
        this.wordsCount = this.editor.getText().length;
        if (this.wordsCount >= this.wordsCountLimit) {
          this.editor.commands.setContent(this.comment, true);
          return;
        }
        this.comment = this.editor.getText().trim();
      },
      onFocus: () => {
        this.showAvatar = false;
      },
      onBlur: () => {
        if (this.comment == "" && this.commentPic == "") {
          this.showAvatar = true;
        } else {
          this.showAvatar = false;
        }
      },
    });
  },
  components: {
    EditorContent,
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      commentListFromId: (state) => state.comment.commentListFromId,
      isLogin: (state) => state.user.isLogin,
      headers: (state) => state.user.headers,
    }),
    baseApi() {
      return process.env.VUE_APP_BASE_API;
    },
  },
  methods: {
    checkLogin() {
      if (!this.isLogin) {
        let payload = { loginDialogVisible: true, isLoginForm: true };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
      }
      return this.isLogin;
    },
    selectEmoji(emoji) {
      this.isShowEmoji = false;
      this.editor.chain().focus().insertContent(emoji.data).run();
    },
    handleEnter() {
      this.handlePost();
    },
    handlePost() {
      let resId = parseInt(this.$route.params.id) || this.resId;
      if (this.comment == "") {
        this.$message({
          message: this.$t("comment.emptyToast"),
          type: "error",
        });
        return;
      }
      postComment({
        communityId: resId,
        parentId: this.commentId,
        content: this.comment,
        image: this.commentPic,
        images: this.images,
      }).then(() => {
        console.log("发布成功");
        this.$emit("success");
        this.$emit("update:replyActive", false);
      });

      this.editor.commands.clearContent(true);
      this.commentPic = "";
      this.images = [];
      this.$emit("closeReplyModal");
    },
    upSuccess(response) {
      this.commentPic = response.data.url;
      this.images.push(response.data);
      this.editor.commands.focus();
    },
    beforeUpload(file) {
      if (!this.isLogin) {
        let payload = { loginDialogVisible: true, isLoginForm: true };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
        return false;
      }
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let accept = this.acceptType.indexOf(extension) < 0 ? false : true;
      if (!accept) {
        this.$message({
          message: "Supported Files:" + this.acceptType,
          type: "warning",
        });
      }
      return accept;
    },
    handleRemovePic(index) {
      console.log(index);
      this.images.splice(index, 1);
      // this.images = [];
    },
  },
};
</script>
<style lang="scss" scoped>
.reply-widget {
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  border: 1px solid #ccc !important;
  border-radius: 10px;
  justify-content: space-between;
  .comment-pic {
    display: flex;
    .pic-wrapper {
      position: relative;
      padding: 10px;
      img {
        width: 100px;
        height: 60px;
        object-fit: cover;
      }
      .remove-handle {
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
    }
  }
  .post-content-wrapper {
    position: relative;
    width: 100%;
    padding: 8px;
    display: flex;
    justify-content: space-between;
    img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      object-fit: cover;
      border-radius: 50%;
      margin-right: 20px;
    }
    .post-content {
      width: 100%;
      ::v-deep .ProseMirror {
        outline: none;
        min-height: 40px;
        max-height: 200px;
        font-size: 20px;
        line-height: 24px;
        overflow: auto;
        white-space: nowrap;
      }

      /* Placeholder (at the top) */
      ::v-deep .ProseMirror p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #adb5bd;
        pointer-events: none;
        height: 0;
      }
    }
  }
  .toolbar {
    display: flex;
    align-items: center;
    padding: 10px 10px;
    position: relative;
    .el-btn-post {
      position: absolute;
      background: #1e78f0;
      height: 40px;
      width: 104px;
      border-radius: 8px;
      bottom: 10px;
      right: 10px;
      color: #ffffff;
    }
    .btn-uppic,
    .btn-emoji {
      background: none;
      border: none;
      font-size: 24px;
      padding: unset !important;
    }

    .words-count {
      position: absolute;
      right: 150px;
      top: 8px;
      color: #ccc;
    }
  }
}
.el-popover {
  background: none !important;
  padding: none;
  border: none;
  .emoji-picker {
    width: 100% !important;
  }
}
</style>
