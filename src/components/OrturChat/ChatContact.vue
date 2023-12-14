<template>
  <div
    :class="'contact-wrapper ' + (active ? 'active' : '')"
    @click="openContact"
  >
    <div class="remove-chat" @click.stop="removeChat">
      <i class="el-icon-close"></i>
    </div>
    <div class="chat-profile">
      <el-badge
        :value="message.unreadCount == 0 ? '' : message.unreadCount"
        class="item"
      >
        <div class="contact-avatar">
          <img :src="message.avatar" />
        </div>
      </el-badge>
      <div class="userinfo-wrapper">
        <span class="contact-nickname">{{ message.nickname }}</span>
        <span class="latest-message">{{ message.latestMessage }}</span>
      </div>
    </div>

    <div class="chat-datetime">
      {{ $d(new Date(message.latestDatetime), "long") }}
    </div>
  </div>
</template>

<script>
import { generatorDefaultAvator } from "@/utils/generateImage";
import { formateDatetime } from "@/utils/common";
export default {
  props: {
    message: {
      type: Object,
      default: () => {
        return {
          userId: 1,
          account: "@1111",
          avatar: generatorDefaultAvator("sinis", 110),
          latestMessage: "This is a latest message!",
          messageList: [
            {
              userId: 1,
              message: "XXXXXXXXXXXXXXXXXX",
              isSelf: false,
            },
          ],
          nickname: "Sis直播群",
          latestDatetime: "12:15:33",
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

  methods: {
    formateDatetime,
    removeChat() {
      //确认框提醒
      this.$confirm(
        this.$t("chatBox.Are you sure want to delete this"),
        this.$t("chatBox.Confirm"),
        {
          confirmButtonText: this.$t("chatBox.Delete"),
          cancelButtonText: this.$t("chatBox.Cancel"),
        }
      )
        .then(() => {
          this.$store.dispatch("im/removeContact", { index: this.index });
        })
        .catch(() => {});
    },
    openContact() {
      if (this.active) {
        this.$store.dispatch("im/readMessage", { index: this.index });
        return;
      }
      this.$emit("update:activeContact", this.index);
      //加载历史消息
      this.$store
        .dispatch("im/getHistoryMessage", {
          params: {
            userId: this.message.userId,
            pageSize: 20,
            pageNum: 1,
          },
          currentIndex: this.index,
          isfirst: true,
        })
        .then(() => {
          return this.$store
            .dispatch("im/readMessage", { index: this.index })
            .then((contact) => {
              if (!contact.isOpen) {
                contact.isOpen = true;
                this.$chatSocket.scrollViewToBottom();
              }
            });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.contact-wrapper {
  position: relative;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  .chat-profile {
    display: flex;
    margin-left: 20px;
    .contact-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .userinfo-wrapper {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .contact-nickname {
        width: 90px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .latest-message {
        width: 90px;
        color: #b8b8b8;
        font-size: 12px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  .chat-datetime {
    height: 100%;
    color: #b8b8b8;
    font-size: 12px;
  }

  .remove-chat {
    display: none;
    position: absolute;
    left: 5px;
    top: 12px;
    font-size: 26px;
    z-index: 1;
  }
}
.contact-wrapper.active {
  background: #d6d6d6;
}
.contact-wrapper:not(.active):hover {
  background: #f0f0f0;
}
.contact-wrapper:hover .remove-chat {
  display: block;
}
</style>
