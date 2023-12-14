<template>
  <div :class="'chat-dialog-wrapper ' + (active ? 'active' : '')">
    <div class="chat-dialog-header">
      <h2>{{ message.nickname }}</h2>
    </div>
    <div class="chat-dialog-body" @scroll="handleScroll">
      <div
        v-for="(groupItem, groupIndex) in message.groupMessageList"
        :key="groupIndex"
      >
        <div
          class="time"
          v-if="new Date().getTime() - groupItem[0].datetime <= 3600 * 1000"
        >
          <!-- {{ format(groupItem[0].datetime) }} -->
          {{ $d(new Date(groupItem[0].datetime), "long") }}
        </div>
        <div v-else class="time">
          {{ $d(new Date(groupItem[0].datetime), "long") }}
        </div>
        <template v-for="(item, itemIndex) in groupItem">
          <div :key="itemIndex">
            <div v-if="item.type == 'error'" class="error-tip">
              {{ item.message }}
            </div>
            <div class="message-wrapper" v-else-if="!item.isSelf">
              <div class="avatar">
                <img :src="message.avatar" />
              </div>
              <div class="message-content">{{ item.message }}</div>
            </div>
            <div v-else class="message-wrapper self-message">
              <div class="message-content">{{ item.message }}</div>
              <div class="avatar">
                <img :src="userInfo.avatar" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="chat-dialog-footer">
      <div class="sender-wrapper">
        <editor-content
          v-model="msg"
          :editor="editor"
          @keyup.ctrl.enter.exact.native="lineFeed($event)"
          @keyup.shift.enter.exact.native="lineFeed($event)"
          @keyup.enter.exact.native="handlePost"
        ></editor-content>
        <div class="toolbar">
          <div class="toolbar-emoji">
            <el-popover
              placement="bottom"
              trigger="click"
              v-model="isShowEmoji"
            >
              <VEmojiPicker @select="selectEmoji" />
              <el-button class="btn-emoji" slot="reference">
                <i class="ortur-icon-simle"></i>
              </el-button>
            </el-popover>
          </div>
          <div class="toolbar-send">
            <span class="send-num">{{ msg.length }}/{{ maxlen }}</span>
            <el-button class="send-btn" @click="handlePost">{{
              $t("chatBox.Post")
            }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generatorDefaultAvator } from "@/utils/generateImage";
import { Editor, EditorContent } from "@tiptap/vue-2";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { mapState } from "vuex";
import { format } from "timeago.js";
export default {
  data() {
    return {
      editor: null,
      msg: "",
      maxlen: 500,
      isShowEmoji: false,
      currentPageSize: 1,
      pageLock: false,
      isPull: true,
    };
  },
  props: {
    message: {
      type: Object,
      default: () => {
        return {
          avatar: generatorDefaultAvator("acyang", 110),
          latestMessage: "This is a latest message!",
          messageList: [],
          nickname: "Otrur官方频道",
          latestDatetime: "14:15:33",
        };
      },
    },
    active: {
      type: Boolean,
      defualt: false,
    },
    index: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLogin: (state) => state.user.isLogin,
      headers: (state) => state.user.headers,
    }),
  },
  components: {
    EditorContent,
  },
  mounted() {
    this.editor = new Editor({
      content: this.msg,
      autofocus: false,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: this.$t("chatBox.Send a message"),
          showOnlyWhenEditable: false,
        }),
      ],
      onUpdate: () => {
        var content = this.editor.getText().trim();
        if (content.length > this.maxlen) {
          this.editor.commands.setContent(this.msg, false);
          return;
        }
        this.msg = content;
      },
      onFocus: () => {
        this.$store.dispatch("im/readMessage", { index: this.index });
      },
    });
  },
  methods: {
    format,
    handleEnter() {
      this.handlePost();
    },
    handleScroll() {
      var activedialog = document.querySelector(
        ".chat-dialog-wrapper.active .chat-dialog-body"
      );
      var lastScrollHeight = activedialog.scrollHeight;
      if (activedialog.scrollTop == 0) {
        //拉取上一页数据
        if (this.pageLock || !this.isPull) {
          return;
        }
        this.pageLock = true;

        this.$store
          .dispatch("im/getHistoryMessage", {
            params: {
              userId: this.message.userId,
              pageSize: 20,
              pageNum: this.currentPageSize + 1,
            },
            currentIndex: this.index,
          })
          .then((res) => {
            if (res.data.rows.length < 20) {
              this.isPull = false;
            }
            //更新总页码
            this.currentPageSize++;
            this.pageLock = false;
            activedialog.scrollTop =
              activedialog.scrollHeight - lastScrollHeight;
          })
          .catch(() => {
            this.pageLock = false;
          });
      }
    },
    lineFeed() {
      document.querySelector(".sender-wrapper .ProseMirror").scrollTop =
        document.querySelector(".sender-wrapper .ProseMirror").scrollHeight;
    },
    selectEmoji(emoji) {
      this.isShowEmoji = false;
      this.editor.chain().focus().insertContent(emoji.data).run();
    },
    handlePost() {
      if (this.msg.length <= 0) {
        return;
      }
      this.$store
        .dispatch("im/sendMessage", {
          message: this.msg,
          toAccount: this.message.userId,
          account: this.userInfo.user_id,
        })
        .then(() => {
          this.$chatSocket.scrollViewToBottom();
          this.$emit("changeCurrentAcitveContact", this.index);
        })
        .catch(() => {
          this.$chatSocket.scrollViewToBottom();
        });
      this.editor.commands.clearContent(true);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-dialog-wrapper {
  display: none;
  height: 608px;
  .chat-dialog-header {
    height: 68px;
    line-height: 68px;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
  }
  .chat-dialog-body {
    padding: 16px;
    height: 400px;
    overflow: auto;
    .time {
      width: 100%;
      margin-bottom: 20px;
      text-align: center;
      color: #b4b4b4;
      font-size: 10px;
    }
    .message-wrapper {
      margin-bottom: 20px;
      display: flex;
      .avatar {
        width: 48px;
        height: 48px;
        overflow: hidden;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .message-content {
        margin-left: 16px;
        max-width: 60%;
        word-break: break-all;
        background: #f0f0f0;
        border-radius: 0px 12px 12px 12px;
        padding: 16px;
        font-size: 14px;
        color: #1a1a1a;
        white-space: pre-wrap;
      }
    }
    .self-message {
      justify-content: flex-end;
      .message-content {
        background: #1e78f0;
        border-radius: 12px 0px 12px 12px;
        color: #ffffff;
        margin-right: 16px;
      }
    }
    .error-tip {
      margin-bottom: 20px;
      align-items: center;
      color: #b4b4b4;
      font-size: 10px;
      text-align: center;
    }
  }
  .chat-dialog-footer {
    width: 100%;
    overflow: hidden;
    ::v-deep .ProseMirror {
      outline: none !important;
      height: 80px;
      border-top: 1px solid #e6e6e6;
      overflow: auto;
      padding: 10px;
      line-height: 20px;
    }
    ::v-deep .ProseMirror p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #adb5bd;
      pointer-events: none;
      height: 0;
    }
    .toolbar {
      padding: 5px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .toolbar-emoji {
        .el-button {
          font-size: 24px;
          border: unset;
          outline: unset;
        }
      }
      .toolbar-send {
        .send-num {
          color: #ccc;
          font-size: 14px;
          margin-right: 20px;
        }
        .el-button {
          width: 104px;
          height: 40px;
          background: #1e78f0;
          border-radius: 8px;
          color: #fff;
        }
      }
    }
  }
}
.chat-dialog-wrapper.active {
  display: flex;
  flex-direction: column;
}
</style>
