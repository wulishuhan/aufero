<template>
  <div class="tutorial-wrapper">
    <div
      v-for="(item, stepIndex) in step"
      :key="stepIndex"
      class="tutorial-step"
    >
      <h2>{{ item.title }}</h2>
      <div class="description">
        <pre style="white-space: pre-line">
          {{ item.description }}
        </pre>
      </div>
      <div class="images">
        <img
          v-for="(item, imgIndex) in item.images"
          :src="item.url"
          :key="imgIndex"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Tutorial",
  props: {
    step: {
      type: Array,
      default: () => {
        return [
          {
            title: "Step 1",
            description: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            images: [
              "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
              "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
              "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
              "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
              "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
              "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
              "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
            ],
          },
        ];
      },
    },
  },
  data() {
    return {};
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.tutorial-wrapper {
  .tutorial-step + .tutorial-step {
    margin-top: 20px;
  }
}
h2 {
  font-size: 20px;

  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 21px;
}
.description {
  font-size: 20px;

  font-weight: 400;
  color: #9e9e9e;
  line-height: 30px;
  margin-bottom: 21px;
}
.images {
  width: 637px;
  display: flex;
  flex-direction: column;
}
img {
  max-width: 637px;
  // height: 144px;
  margin-top: 10px;
}
</style>
