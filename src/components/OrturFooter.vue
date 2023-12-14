<template>
  <div class="ortur-footer">
    <h1>Ortur</h1>
    <ul>
      <li>Legal</li>
      <li>Privacy</li>
      <li>Policy</li>
      <li>Contact Us</li>
      <li>Developers</li>
    </ul>
  </div>
</template>
<script>
export default {
  //eslint-disable-next-line
  name: "OrturFooter",
};
</script>
<style lang="scss" scoped>
.ortur-footer {
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-top: solid 1px #ccc;
  margin-top: 5px;
}
ul {
  display: flex;
  flex-flow: row nowrap;
  list-style: none;
  justify-content: space-between;
  align-items: center;
}
li {
  padding: 10px;
}
</style>
