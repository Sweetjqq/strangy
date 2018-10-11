<template>
  <div class="components-container" style="overflow-x: hidden;">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 50px;padding-left: 20px;box-sizing: border-box">
      <el-breadcrumb-item>我的策略</el-breadcrumb-item>
      <el-breadcrumb-item>策略列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑图文</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="message">
      <el-form>
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="3" placeholder="请输入64个字符内的标题" autofocus clearable="true" resize="none"
            :maxlength="length" v-model="form.title" style="width: 400px">
          </el-input>
        </el-form-item>
        <el-form-item label="系统布局" :label-width="formLabelWidth">
          <el-checkbox v-model="form.checked"></el-checkbox>
          <span style="display: inline-block;color: red;margin-left: 20px">温馨提示：编辑框内删除语音，请点击两次backspace</span>
        </el-form-item>
       
      </el-form>
    </div>

    <div class="editor-container">
      <MyUE :defaultMsg=defaultMsg :config=config ref="ue" :state=state :CoverPic=CoverPic></MyUE>
    </div>
    <div style="text-align: center;margin-bottom: 30px">
      <el-button type="primary" style="background: #4778c7;border-color: #4778c7;width: 95px;" @click="getUEContent()">保存</el-button>
      <el-button type="danger" style="width: 95px;margin-left: 30px;" @click="deleteStry()">删除</el-button>
      <el-button type="default" style="width: 95px;margin-left: 30px;" @click="goBack()">返回</el-button>
    </div>
    <div v-html='content' id='dis' style="display: none;"></div>
    <div style="display: none">
      <el-button type="default" style="margin-left: 30px;" @click="textMu()">测试mutation</el-button>
      <el-button type="default" style="margin-left: 30px;" @click="textge()">测试gettters</el-button>
      <el-button type="default" style="margin-left: 30px;" @click="textac()">测试action</el-button>
      <div>{{title}}</div>
    </div>
  </div>
</template>
<script>
  import MyUE from '../../PageConponents/MyUE.vue';
  import {
    setStore,
    getStore,
    getCookie,
    parseUrl
  } from '../../../config/mUtils'
  import {
    mapState,mapGetters
  } from 'vuex';
  export default {
    components: {
      MyUE
    },
    data() {
      return {
        defaultMsg: '',
        state: true,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        },
        content: '',
        formLabelWidth: '80px',
        form: {
          title: '',
          checked: true,
        },
        length: 64,
        CoverPic: {
          title: "",
          url: ""
        }
      }
    },
    computed:{
      ...mapState(["title"]),
      ...mapGetters(["changePeople"])
    },
    methods: {
      textac(){
        this.$store.dispatch('getParamSync',{
          AccoundId: 'chaochao',
          Authorization: true,
        })
        console.log(this.$store.state.START_PARMA, "**************");
      },
      textge(){
        console.log(this.changePeople,"********getters********");
      },
      textMu() {
        this.$store.commit('getParam', {
          AccoundId: 'sunhongchao',
          Authorization: true,
        })
        console.log(this.$store.state.START_PARMA, "**************");
      },
      // 根据策略id查询策略图文
      GetstragyDetail() {
        axios({
          method: "get",
          url: "/v1/tacticsImageText/getTacticsImageTextByTacticsId",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            tacticsId: parseUrl().id,
          }
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            console.log(response.data, "根据策略id查询策略图文");
            let data = response.data.data;
            if (data != null) {
              this.defaultMsg = data.content;
              this.CoverPic.title = data.coverImgName;
              this.CoverPic.url = data.coverImg;
              console.log(this.CoverPic, "this.CoverPic");
              this.form = {
                title: data.title,
                checked: data.layout == 1 ? true : false,
              }
              setTimeout(() => {
                if (this.$refs.ue) {
                  this.$refs.ue.haveUE();
                }
              }, 10)
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },
      // 获取富文本编辑器内容
      getUEContent() {
        if (this.$refs.ue) {
          let content = this.$refs.ue.getUEContent();
          this.content = content;
          setTimeout(() => {
            let imgArr = document.getElementById("dis").getElementsByTagName("img");
            for (let item of imgArr) {
              console.log(item.id, "**************");
            }
          }, 10)
          console.log(content, "富文本编辑器***************");
          console.log(this.form, "表单****************");
          this.SaveStragyChart();
        }
      },
      // 保存策略图文
      SaveStragyChart() {
        console.log(this.$refs.ue.getCoverPic(), "封面图对象");
        let CoverPic = this.$refs.ue.getCoverPic().url;
        let coverImgName = this.$refs.ue.getCoverPic().title;
        axios({
          method: "post",
          url: "/v1/tacticsImageText/saveTacticsImageText",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          data: {
            tacticsId: parseUrl().id,
            title: this.form.title,
            layout: this.form.checked ? 1 : 0,
            content: this.content,
            coverImg: CoverPic,
            coverImgName: coverImgName,
            userName: getCookie("UserId")
          },
          transformRequest: [
            function (data) {
              let ret = "";
              for (let it in data) {
                ret +=
                  encodeURIComponent(it) +
                  "=" +
                  encodeURIComponent(data[it]) +
                  "&";
              }
              return ret;
            }
          ]
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            console.log(response.data, "保存策略图文");
            this.$message({
              message: "保存策略图文成功",
              type: "success"
            });
            setTimeout(() => {
              this.$router.push("/StrategyList");
            }, 2500)
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },
      goBack() {
        this.$router.push("/StrategyList");
      },
      deleteStry() {
        this.$confirm('确定删除?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delStragyChart();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          setTimeout(() => {
            this.$router.push("/StrategyList");
          }, 2500)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
      // 删除策略图文
      delStragyChart() {
        axios({
          method: "post",
          url: "/v1/tacticsImageText/deleteTacticsImageText",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          data: {
            tacticsId: parseUrl().id,
            updateUser: getCookie("UserId")
          },
          transformRequest: [
            function (data) {
              let ret = "";
              for (let it in data) {
                ret +=
                  encodeURIComponent(it) +
                  "=" +
                  encodeURIComponent(data[it]) +
                  "&";
              }
              return ret;
            }
          ]
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            console.log(response.data, "删除策略图文");
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },

    },
    created() {

    },
    mounted() {
      this.GetstragyDetail();
    }
  };

</script>
<style scoped>
  .message {
    padding: 10px 12px 1px;
    box-sizing: border-box;
    border: 1px solid #eeebeb;
    margin-bottom: 20px;
  }

</style>
