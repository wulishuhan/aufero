<template>
  <div class="chat-dialog-wrapper">
    <div class="chat-dialog-header"></div>
    <div class="chat-dialog-body" v-if="contactList.length <= 0">
      <img :src="bg" />
      <div style="color: #cccccc; text-align: center">
        {{ $t("chatBox.There's nothing here") }}
      </div>
    </div>
  </div>
</template>

<script>
import nomsg_img from "@/assets/img/nomsg.png";
import { mapState } from "vuex";
export default {
  data() {
    return {
      bg: nomsg_img,
    };
  },
  computed: {
    ...mapState({
      contactList: (state) => state.im.contactList,
    }),
  },
};
</script>

<style lang="scss" scoped>
.chat-dialog-header {
  height: 68px;
  line-height: 68px;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
}
.chat-dialog-body {
  img {
    display: block;
    margin: 50px auto;
  }
}
</style>
