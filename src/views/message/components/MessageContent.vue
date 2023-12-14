<template>
  <div>
    <mark-read
      :activeName="activeName"
      @markRead="markRead"
      class="content-body"
      v-show="currentType != 8"
    ></mark-read>
    <div class="content-body content-chat" v-show="currentType == 8">
      <!-- 此处渲染聊天 -->
      <ortur-chat></ortur-chat>
    </div>
    <div class="content-body" v-show="currentType != 8">
      <tip
        v-for="item in messageList"
        :tipType="item.type"
        :message="item"
        :key="item.id"
      ></tip>
      <div v-show="loading" class="loading">
        <div class="donut-spin"></div>
      </div>
      <div v-show="total == messageList.length && !loading" class="no-more">
        {{ $t("message.No more") }}
      </div>
    </div>
  </div>
</template>
<script>
import Tip from "./Tip.vue";
import MarkRead from "./MarkRead.vue";
import OrturChat from "@/components/OrturChat";
export default {
  // eslint-disable-next-line
  name: "MessageContent",
  components: { Tip, MarkRead, OrturChat },
  props: {
    activeName: { type: String, default: "All" },
    currentType: { type: Number, default: 0 },
    messageList: { type: Array, default: () => [] },
    total: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
    noMore: { type: Boolean, default: false },
  },
  data() {
    return {
      // activeName: "",
      // messageList: [],
      load: () => {},
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
    };
  },
  methods: {
    markRead() {
      this.isReaded = !this.isReaded;
    },
  },
};
</script>
<style lang="scss" scoped>
.no-more {
  font-size: 20px;
  font-weight: 500;
  color: #cccccc;
  text-align: center;
  height: 128px;
  line-height: 128px;
}
.content-body {
  padding: 0 32px;
}
.content-chat {
  padding: 0px;
}
.ortur-icon-circle {
  font-size: 60px;
  color: #1e78f0;
  animation: circle 1.2s infinite linear;
}
.loading {
  text-align: center;
  margin-top: 36px;
  .donut-spin {
    display: inline-block;
    border: 4px solid #1e78f0;
    border-left-color: #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: circle 1.2s linear infinite;
  }
}
@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
