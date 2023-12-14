<template>
  <div style="display: flex">
    <FloatingMenu
      ref="test"
      :editor="editor"
      :tippyOptions="{ placement: 'left', offset: [0, 20] }"
    >
      <el-dropdown trigger="click" placement="left-end">
        <span class="el-dropdown-link">
          <i class="el-icon-plus"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            icon="el-icon-plus"
            @click.native="
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            "
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            >title</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-circle-plus">
            subtile
          </el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus">photo</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </FloatingMenu>
    <editor-content :editor="editor" class="desc-editor" />

    <ortur-chat style="margin-top: 100px"></ortur-chat>
  </div>
</template>
<script>
import { Editor, EditorContent, FloatingMenu } from "@tiptap/vue-2";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Focus from "@tiptap/extension-focus";
import OrturChat from "@/components/OrturChat";
import ImEvent from "@/utils/im/event";
export default {
  // eslint-disable-next-line
  name: "zwy",
  data() {
    return {
      editor: null,
      data: [],
      currentCoverEditKey: 0,
    };
  },
  components: {
    EditorContent,
    FloatingMenu,
    OrturChat,
  },
  created() {
    this.editor = new Editor({
      content: "",
      extensions: [
        StarterKit,
        Focus.configure({
          className: "has-focus",
          mode: "all",
        }),
        Placeholder.configure({
          placeholder: "my custom placeholder",
        }),
      ],
      onUpdate({ editor }) {
        // The content has changed.
        console.log("onUpdate:", editor);
      },
      onSelectionUpdate({ editor }) {
        // The selection has changed.
        console.log("onSelectionUpdate", editor);
      },
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  mounted() {
    var client = this.$chatSocket;
    console.log(client);
    client.on(ImEvent.CONNECT, function () {
      console.log("连接成功");
      // client.sendMessage(
      //   client.createTextMessage("hello world!"),
      //   "hahahhahah"
      // );
    });
    client.on(ImEvent.FRIEND_LIST_UPDATED, (e) => {
      console.log("触发事件", e);
    });
    client.on(ImEvent.FRIEND_ONLINE, (e) => {
      console.log("触发事件", e);
      this.$store.dispatch("im/addContact", {
        userId: 180,
        avatar: "",
        latestMessage: "This is a latest message!",
        messageList: [
          {
            userId: 1,
            message: "我是最新的好友!",
            isSelf: false,
          },
        ],
        nickname: "新好友",
        latestDatetime: "14:15:33",
      });
    });
  },
  methods: {
    onCoverAddSuccess(response) {
      let imgInfo = {
        id: response.id,
        url: response.url,
        name: response.name,
        size: response.size,
      };
      this.data.push(imgInfo);
    },
    handleRemoveCover(removeKey) {
      this.data.splice(removeKey, 1);
    },
    onCoverEditSuccess(response) {
      let imgInfo = {
        id: response.id,
        url: response.url,
        name: response.name,
        size: response.size,
      };
      this.data.splice(this.currentCoverEditKey, 1, imgInfo);
    },
    handleClick() {
      console.log(21);
    },
    shouldShow({ editor, view, state }) {
      console.log("shouldShow", editor, view, state);
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.desc-editor {
  width: 800px;
  border: 1px solid red;
  padding: 10px;
  ::v-deep .ProseMirror {
    outline: none !important;
    min-height: 300px;
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
.tippy-box .tippy-content {
  background: #aaa;
}
.el-button {
  color: #000;
  font-weight: 700;
}
</style>
