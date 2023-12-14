<template>
  <span @click.stop="stopBublet">
    <el-button @click="click" class="baseButton button" :disabled="disabled">
      <i class="el-icon--left" v-show="!isCollect">
        <!-- <svg
          width="15"
          height="15"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.19503 16.7812H3.49164C2.5042 16.7812 2.01048 16.7812 1.6307 16.5952C1.26706 16.4171 0.973022 16.123 0.794881 15.7594C0.608826 15.3796 0.608826 14.8859 0.608826 13.8984V4.10157C0.608826 3.11413 0.608826 2.62041 0.794881 2.24062C0.973022 1.87699 1.26706 1.58295 1.6307 1.40481C2.01048 1.21875 2.5042 1.21875 3.49164 1.21875H5.46812C5.84649 1.21875 6.03568 1.21875 6.21638 1.25566C6.39056 1.29123 6.55861 1.35207 6.7152 1.43625C6.87764 1.52358 7.02298 1.6447 7.31365 1.88693L8.92986 3.23376C9.22054 3.47599 9.36587 3.59711 9.52832 3.68444C9.6849 3.76862 9.85295 3.82946 10.0271 3.86503C10.2078 3.90194 10.397 3.90194 10.7754 3.90194H16.5083C17.4958 3.90194 17.9895 3.90194 18.3693 4.088C18.7329 4.26614 19.027 4.56018 19.2051 4.92381C19.3912 5.3036 19.3912 5.79732 19.3912 6.78476V8.19504M15.3664 9.98314V13.3822M15.3664 13.3822V16.7812M15.3664 13.3822H11.9673M15.3664 13.3822H18.7654"
            stroke="black"
            stroke-linecap="round"
          />
        </svg> -->
        <i class="ortur-icon-add-collect icon-collect"></i>
      </i>
      <span v-show="isCollect" class="ortur-icon-add-collect icon-collect"
        ><span class="path1"></span><span class="path2"></span
        ><span class="path3"></span
      ></span>
      <span class="num">{{ numText }}</span>
    </el-button>
  </span>
</template>

<script>
export default {
  methods: {
    click() {
      this.$emit("click");
    },
    stopBublet() {},
  },
  props: {
    collectionNum: {
      type: Number,
      default: 0,
    },
    isCollect: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    numText() {
      let numText = "";
      if (this.collectionNum < 0) {
        numText = "0";
      } else if (this.collectionNum < 1000) {
        numText = "" + this.collectionNum;
      } else {
        numText = Math.floor(this.collectionNum / 1000) + "k";
      }
      return numText;
    },
  },
};
</script>

<style></style>
<style lang="scss" scoped>
.button {
  width: 96px;
  height: 48px;
  .num {
    color: #000;
    font-size: 16px;
    margin-left: 15px;
  }
}
.ortur-icon-cancel-collect-fill {
  /* margin-left: 5px; */
  font-size: 18px;
}
.ortur-icon-add-collect {
  font-size: 18px;
}
</style>
