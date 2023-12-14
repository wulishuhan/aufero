<template>
  <div class="chat-box-wrapper">
    <div class="contact-list">
      <div class="search-input-container">
        <h3
          style="
            height: 100%;
            line-height: 68px;
            text-align: center;
            border-bottom: 1px solid #e6e6e6;
          "
        >
          {{ $t("chatBox.Private message") }}
        </h3>
      </div>
      <template v-for="(item, index) in contactList">
        <chat-contact
          :active="index == activeContact"
          :key="item.userId"
          :index="index"
          :activeContact.sync="activeContact"
          :message="item"
        >
        </chat-contact>
      </template>
    </div>
    <div class="chat-dialog">
      <template v-for="(item, index) in contactList">
        <chat-dialog
          :active="index == activeContact"
          :key="item.userId"
          :index="index"
          :activeContact.sync="activeContact"
          :message="item"
          @changeCurrentAcitveContact="changeCurrentAcitveContact"
        >
        </chat-dialog>
      </template>
      <no-chat v-if="activeContact == -1"></no-chat>
    </div>
  </div>
</template>

<script>
import ChatContact from "@/components/OrturChat/ChatContact.vue";
import ChatDialog from "./ChatDialog.vue";
import NoChat from "./NoChat.vue";
import { mapState } from "vuex";
import "@/utils/socket";
export default {
  data() {
    return {
      activeContact: -1,
    };
  },
  computed: {
    ...mapState({
      contactList: (state) => state.im.contactList,
    }),
  },
  components: { ChatContact, ChatDialog, NoChat },
  mounted() {
    this.$store.dispatch("im/getContactList").then(() => {
      this.$chatSocket.on("chat", (e) => {
        this.$store.dispatch("im/reciveMessage", e.data).then(() => {
          if (this.activeContact >= 0) {
            this.$chatSocket.scrollViewToBottom();
          }
        });
      });
    });
  },
  methods: {
    changeCurrentAcitveContact(index) {
      this.activeContact = index;
    },
  },
};
</script>
<style lang="scss" scoped>
.chat-box-wrapper {
  display: flex;
  font-size: 14px;
  color: #262626;
  background: #fff;
  width: 1200px;
  min-height: 608px;
  font-style: normal;
  font-weight: 400;
  .contact-list {
    width: 320px;
    overflow: auto;
    border-right: 1px solid #aaa;
    .search-input-container {
      height: 68px;
    }
  }
  .chat-dialog {
    width: 900px;
  }
}
</style>
