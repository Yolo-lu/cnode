<template>
  <div>
    <div class="title">
      <div class="box" v-if="details.top === true">置顶</div>
      <div class="title-1">{{ details.title }}</div>
    </div>
    <div class="title-2">
      •发布于
      <span v-if="details.day">{{ details.day }}天前</span>
      <span v-else-if="details.min">{{ details.min }}分钟前</span>
      <span v-else-if="details.hours">{{ details.hours }}小时前</span>
      <span v-else-if="details.month">{{ details.month }}月前</span>
      <span> •作者{{ details.author.loginname }} </span>
      <span> •浏览{{ details.visit_count }} </span>
      <span>
        •来自
        <span v-if="details.tab === 'share'">分享</span>
        <span  v-else-if="details.tab === 'ask'">问答</span>
      </span>
    </div>

    <div class="content" v-html="details.content">{{ details.content }}</div>
    <div class="comment">
      <div class="top">{{ details.reply_count }}回复</div>
      <el-card>
        <div
          class="left"
          v-for="(item, index) in details.replies"
          :key="item.id"
        >
          <div class="img"><img :src="item.author.avatar_url" alt="" /></div>
          <div class="author">{{ item.author.loginname }}</div>
          <div class="floor">
            {{ index + 1 }}楼.
            <span v-if="item.day">{{ item.day }}天前</span>
            <span v-else-if="item.min">{{ item.min }}分钟前</span>
            <span v-else-if="item.hours">{{ item.hours }}小时前</span>
            <span v-else-if="item.month">{{ item.month }}月前</span>
          </div>
          <div v-html="item.content">{{ item.content }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import { Loading } from 'element-ui';
export default {
  name: "Detail",
  components: {},
  props: {},
  data() {
    return {
      id: "",
      details: {},
      loadingInstance:false
    };
  },
  methods: {
    get() {
      this.$axios
        .req(`/api/topic/${this.id}`) /*获取传来的数据 */
        .then(response => {
          this.details = response.data;
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            this.loadingInstance.close();
          });
          console.log(response.data);
          let nowTime = Date.now(); /*获取当前时间戳*/
          // console.log(nowTime);
          this.details.replies.map(item => {
            let difference =
              nowTime -
              this.$dayjs(item.create_at).valueOf(); /*将时间转换为时间戳*/
            let time = difference / 1000 / 60 / 60;
            let day = Math.ceil(time / 24);
            let hours = Math.floor(time);
            let min = Math.floor(time * 60);
            let month = Math.ceil(time / 720);
            if (time < 1) {
              this.$set(item, "min", min); /*创建属性*/
            } else if (time > 24 && time < 720) {
              this.$set(item, "day", day);
            } else if (time > 720) {
              this.$set(item, "month", month);
            } else {
              this.$set(item, "hours", hours);
            }
          });

          let difference =
            nowTime -
            this.$dayjs(
              this.details.create_at
            ).valueOf(); /*将时间转换为时间戳*/
          let time = difference / 1000 / 60 / 60;
          let day = Math.ceil(time / 24);
          let hours = Math.floor(time);
          let min = Math.floor(time * 60);
          let month = Math.ceil(time / 720);
          if (time < 1) {
            this.$set(this.details, "min", min); /*创建属性*/
          } else if (time > 24 && time < 720) {
            this.$set(this.details, "day", day);
          } else if (time > 720) {
            this.$set(this.details, "month", month);
          } else {
            this.$set(this.details, "hours", hours);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  mounted() {
    this.loadingInstance=Loading.service({
      text: "加载中,敬请期待..."
    });
    this.id = this.$route.query.id; /*接收路由传来的参数*/
    this.get();
  },
  created() {},
  filters: {},
  computed: {},
  watch: {},
  directives: {}
};
</script>

<style scoped lang="scss">
.title {
  display: flex;
  justify-content: start;
  align-items: center;
  background: white;
}
.box {
  margin: 0 5px;
  width: 40px;
  height: 30px;
  background: #80bd01;
  padding: 2px;
  color: white;
  border-radius: 3px;
  font-size: 12px;
  line-height: 30px;
  text-align: center;
}
.title-1 {
  font-size: 22px;
  font-weight: 700;
}
.title-2 {
  font-size: 12px;
  color: #838383;
  background: white;
  height: 20px;
  line-height: 20px;
}
.content {
  /deep/ img {
    width: 100%;
  }
  background: white;
}
.comment {
  background: white;
  .top {
    height: 20px;
    padding: 10px;
    background: #f6f6f6;
  }
}
.left {
  display: flex;
  justify-content: start;
  align-items: flex-start;
  .img img {
    width: 30px;
    height: 30px;
  }
  .author {
    font-size: 12px;
    font-weight: bold;
    color: #666;
    padding-left: 10px;
  }
  .floor {
    color: #005580;
    padding-left: 10px;
    font-size: 12px;
  }
}
</style>
