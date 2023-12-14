<template>
  <div class="params" v-show="show">
    <h2 class="title">{{ $t("thing.Parameters") }}</h2>
    <div class="grid">
      <div class="params-item" v-if="material != ''">
        <svg-icon icon-class="material" class-name="icon-material"></svg-icon>
        <span class="info">
          <span class="name">{{ $t("thing.Material") }}</span>
          <span class="material">{{ material }}</span>
        </span>
      </div>
      <div class="params-item" v-if="quality != ''">
        <svg-icon icon-class="quality" class-name="icon-quality"></svg-icon>
        <span class="info">
          <span class="name">{{ $t("thing.Quality") }}</span>
          <span class="material">{{ quality }}</span>
        </span>
      </div>
      <div class="params-item" v-if="power != ''">
        <svg-icon icon-class="power" class-name="icon-power"></svg-icon>
        <span class="info">
          <span class="name">{{ $t("thing.Power") }}</span>
          <span class="material">{{ power }}</span>
        </span>
      </div>
      <div class="params-item" v-if="mode != ''">
        <svg-icon icon-class="mode" class-name="icon-mode"></svg-icon>
        <span class="info">
          <span class="name">{{ $t("thing.Mode") }}</span>
          <span class="material">{{ mode }}</span>
        </span>
      </div>
      <div class="params-item" v-if="speed != ''">
        <svg-icon icon-class="speed" class-name="icon-speed"></svg-icon>
        <span class="info">
          <span class="name">{{ $t("thing.Speed") }}</span>
          <span class="material">{{ speed }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Parameters",
  props: ["material", "mode", "power", "quality", "speed"],
  computed: {
    show() {
      return (
        this.material || this.mode || this.power || this.quality || this.speed
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.params {
  margin-top: 32px;
  .title {
    font-size: 20px;

    font-weight: 400;
    color: #1a1a1a;
  }
  .grid {
    grid-template-columns: auto auto;
    grid-row-gap: 32px;
    grid-column-gap: 48px;
    display: grid;

    font-weight: 400;
    margin-top: 32px;
    .params-item {
      display: flex;
      align-items: center;
      .icon-material {
        width: 30px;
        height: 24px;
      }
      .icon-quality {
        width: 32px;
        height: 32px;
      }
      .icon-power {
        width: 30px;
        height: 30px;
      }
      .icon-mode {
        width: 30px;
        height: 30px;
      }
      .icon-speed {
        width: 30px;
        height: 30px;
      }
      .info {
        display: flex;
        flex-direction: column;
        margin-left: 12px;
        .name {
          color: #1a1a1a;
          font-size: 16px;
        }
        .material {
          color: #999999;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
