<template>
  <div>
    <ShareSocialMedia></ShareSocialMedia>
    <CollectButton @click="onColect" :isCollect="true"></CollectButton>
    <CollectButton></CollectButton>
    <StarButton @click="onStar"></StarButton>
    <StarButton :isStar="true"></StarButton>
    <DownLoadButton></DownLoadButton>
    <BaseButton @click="test">基础按钮</BaseButton>
    <LabelCard></LabelCard>

    <NoticePanel></NoticePanel>
  </div>
</template>
<script>
import ShareSocialMedia from "@/components/ShareSocialMedia.vue";
import StarButton from "@/components/StarButton.vue";
import CollectButton from "@/components/CollectButton.vue";
import DownLoadButton from "@/components/DownLoadButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import LabelCard from "@/components/LabelCard.vue";
import NoticePanel from "@/components/NoticePanel.vue";

// 用来预览组件
export default {
  // eslint-disable-next-line
  name: "hzy",
  data() {
    return {
      folders: [
        {
          name: "111",
          id: "1",
          isEdit: false,
          showMoreMenu: false,
        },
        {
          name: "222",
          id: "2",
          isEdit: false,
          showMoreMenu: false,
        },
        {
          name: "222",
          id: "2",
          isEdit: false,
          showMoreMenu: false,
        },
        {
          name: "222",
          id: "2",
          isEdit: false,
          showMoreMenu: false,
        },

        {
          name: "222",
          id: "2",
          isEdit: false,
          showMoreMenu: false,
        },
      ],
    };
  },
  methods: {
    handleClickFolder(item) {
      console.log("item: ", item);
    },
    onFolderAdd() {
      return new Promise((resolve) => {
        return resolve(1);
      });
      // this.folder = [...e];
    },
    onStar() {
      //console.log(e)
      console.log(111);
    },
    onColect() {
      //console.log(e)
      console.log(111);
    },
    test() {
      console.log(11);
    },
  },
  components: {
    ShareSocialMedia,
    StarButton,
    DownLoadButton,
    CollectButton,
    BaseButton,
    LabelCard,
    NoticePanel,
  },
};
</script>
