<template>
  <div>
    <header class="about-header">
      <h1>ABOUT ORTUR THINGS</h1>
    </header>
    <section class="about-content">
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-card class="box-card">
            <div slot="header" class="box-card-header">
              <i class="el-icon-edit"></i>
              <p>MAKE</p>
            </div>
            <p>
              We need your brilliant designs. Get on a 3D modeling program
              and/or 3D scanner and start to create, construct, and innovate!
              Build something cool, useful, or just fun. Then upload the file to
              Thingiverse and tell us all about it.
            </p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-card class="box-card">
            <div slot="header" class="box-card-header">
              <i class="el-icon-share"></i>
              <p>SHARE</p>
            </div>
            <p>
              Show us what you made: the world wants to see it! 3D modeling and
              printing is still in its infancy. The more you share your work,
              the more your designs inspire others, get printed, and do awesome
              things.
            </p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-card class="box-card">
            <div slot="header" class="box-card-header">
              <i class="el-icon-search"></i>
              <p>DISCOVER</p>
            </div>
            <p>
              The Thingiverse community has uploaded over 2,310,590 3D models,
              and that number is growing every day. Check out all the incredible
              objects people have created, and get inspired to make your own!
            </p>
          </el-card>
        </el-col>
      </el-row>
      <el-card>
        <div>
          <section>
            <h1>What is Thingiverse?</h1>
            <p>
              MakerBot's Thingiverse is a thriving design community for
              discovering, making, and sharing 3D printable things. As the
              world's largest 3D printing community, we believe that everyone
              should be encouraged to create and remix 3D things, no matter
              their technical expertise or previous experience. In the spirit of
              maintaining an open platform, all designs are encouraged to be
              licensed under a Creative Commons license, meaning that anyone can
              use or alter any design.
            </p>
          </section>
          <section>
            <h1>How Can I Get Involved?</h1>
            <p>
              The best way to get involved with Thingiverse is to try your hand
              at 3D designing. Thingiverse isn't just made up of designers,
              engineers, or CAD drawing experts: anyone can learn. But that's
              not the only way to participate... Gaining street cred can be as
              simple as posting your Makes (prints of an existing design), or
              creating your own mod template for your favorite 3D design in
              Customizer, our first app that uses the Thingiverse API.
            </p>
          </section>
        </div>
      </el-card>
      <el-card>
        <div style="display: flex; justify-content: space-between">
          <a
            href="https://twitter.com/Ortur3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            <el-button> Follow Thingiverse on Twitter </el-button>
          </a>
          <a
            href="https://www.instagram.com/accounts/login/?next=/orturofficial/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <el-button>Follow Thingiverse on Instagram</el-button>
          </a>
        </div>
      </el-card>
    </section>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line
  name: "about",
};
</script>
<style lang="scss" scoped>
.about-content {
  width: 970px;
  margin: 0 auto;
}
.about-header {
  height: 275px;
  text-align: center;
  border: solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #000;
  h1 {
    color: #fff;
  }
}
.box-card {
  height: 300px;
  width: 300px;
  background-color: #fff;
  margin: 20px auto;
}
.box-card-header {
  text-align: center;
}
i {
  font-size: 50px;
  color: #248bfb;
}
@media screen and (max-width: 970px) {
  .about-content {
    width: 100%;
  }
}
</style>
