<template>
  <div class="components-container" style="overflow-x: hidden;">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 50px;padding-left: 20px;box-sizing: border-box">
      <el-breadcrumb-item>售后管理</el-breadcrumb-item>
      <el-breadcrumb-item>图文列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑图文</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="message">
      <el-form :inline="true">
        <el-form-item label="文章标题" :label-width="formLabelWidth">
          <el-input style="width: 200px" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="文章作者" :label-width="formLabelWidth">
          <el-input style="width: 200px" v-model="form.author"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="选择持仓截点日期" :label-width="formLabelWidth">
          <el-date-picker style="width: 200px" v-model="form.time" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="系统布局" :label-width="formLabelWidth">
          <el-checkbox v-model="form.checked"></el-checkbox>
        </el-form-item>
      </el-form>
      <span style="display: inline-block;color: red;margin-bottom: 10px">温馨提示：编辑框内删除语音，请点击两次backspace</span>
    </div>

    <div class="editor-container">
      <MyUE :defaultMsg=defaultMsg :config=config ref="ue" :CoverPic=CoverPic :label=label></MyUE>
    </div>
    <div style="text-align: center">
      <el-button type="primary" style="background: #4778c7;border-color: #4778c7;" @click="getUEContent1()" v-if="state!=3">保存为原图文</el-button>
      <el-button type="primary" style="background: #4778c7;border-color: #4778c7;margin-left: 50px;" @click="getUEContent()">保存为新图文</el-button>
    </div>

    <div v-html='content' id='dis' style="display: none;"></div>
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
  export default {
    components: {
      MyUE
    },
    data() {
      return {
        defaultMsg: '',
        // 富文本配置
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        },
        content: '',
        formLabelWidth: '130px',
        // 基础信息
        form: {
          title: '',
          author: '',
          time: '',
          checked: true,
        },
        // 封面图片
        CoverPic: {
          title: "",
          url: ""
        },
        state: "",
        id: "",
        label: ""
      }
    },
    methods: {
      dateToMs(date) {
        let result = new Date(date).getTime();
        return result;
      },
      // 去除空格
      Trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
      },
      // 删除数组中空元素
      removeNull(array) {
        for (var i = 0; i < array.length; i++) {
          if (array[i] == "" || typeof (array[i]) == "undefined") {
            array.splice(i, 1);
            i = i - 1;
          }
        }
        return array;
      },
      // 获取状态值(已撤回)
      getStates() {
        this.state = parseUrl().status;
        this.id = parseUrl().id;
      },
      // 编辑图文
      updateChartText(label) {
        console.log(this.$refs.ue.getCoverPic(), "封面图对象");
        console.log(this.$refs.ue.getLabel(), "标签");
        let deadline;
        let date = new Date(this.form.time);
        let time = this.dateToMs(date);
        if (time) {
          let month = date.getMonth() + 1;
          let strDate = date.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          deadline = date.getFullYear() + '-' + month + '-' + strDate;
        }
        axios({
          method: "post",
          url: "/v1/imageText/updateImageText",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          data: {
            id: parseUrl().id,
            title: this.form.title,
            author: this.form.author,
            deadline: deadline == undefined ? '' : deadline,
            layout: this.form.checked ? 1 : 0,
            content: this.content,
            coverImg: this.$refs.ue.getCoverPic().url,
            tags: label,
            updateUser: getCookie("UserId"),
            coverImgName: this.$refs.ue.getCoverPic().title,
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
            this.$message({
              message: '修改图文成功',
              type: 'success'
            });
            setTimeout(() => {
              this.$router.push("/ChartList");
            }, 2500)
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },
      // 编辑图文逻辑
      getUEContent1() {
        let changelabel = this.$refs.ue.getLabel();
        console.log(changelabel, "%%%%%%%%%%%%%");
        if (this.Trim(this.form.title).length == 0) {
          this.$message({
            message: '标题不能为空',
            type: 'warning'
          });
        } else if (changelabel.indexOf(";") > 0) {
          this.$message({
            message: '请用中文分号分隔标签',
            type: 'warning'
          });
        } else if (changelabel.indexOf("；") > 0 && this.removeNull(changelabel.split("；")).length > 3) {
          this.$message({
            message: '文章标签不能超过3个',
            type: 'warning'
          });
        } else {
          let content = this.$refs.ue.getUEContent();
          this.content = content;
          changelabel = this.removeNull(changelabel.split("；")).join("；");
          this.updateChartText(changelabel);
          console.log(content, "富文本编辑器***************");
          console.log(this.form, "表单****************");
        }
      },
      // 创建图文逻辑
      getUEContent() {
        let changelabel = this.$refs.ue.getLabel();
        console.log(changelabel, "%%%%%%%%%%%%%");
        if (this.Trim(this.form.title).length == 0) {
          this.$message({
            message: '标题不能为空',
            type: 'warning'
          });
        } else if (changelabel.indexOf(";") > 0) {
          this.$message({
            message: '请用中文分号分隔标签',
            type: 'warning'
          });
        } else if (changelabel.indexOf("；") > 0 && this.removeNull(changelabel.split("；")).length > 3) {
          this.$message({
            message: '文章标签不能超过3个',
            type: 'warning'
          });
        } else {
          let content = this.$refs.ue.getUEContent();
          this.content = content;
          changelabel = this.removeNull(changelabel.split("；")).join("；");
          this.CreateProChart(changelabel);
          console.log(content, "富文本编辑器***************");
          console.log(this.form, "表单****************");
        }

      },

      // 创建图文
      CreateProChart(label) {
        console.log(this.$refs.ue.getCoverPic(), "封面图对象");
        console.log(this.$refs.ue.getLabel(), "标签");
        let deadline;
        let date = new Date(this.form.time);
        let time = this.dateToMs(date);
        if (time) {
          let month = date.getMonth() + 1;
          let strDate = date.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate
          }
          deadline = date.getFullYear() + '-' + month + '-' + strDate;
        }
        axios({
          method: "post",
          url: "/v1/imageText/saveImageText",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          data: {
            title: this.form.title,
            author: this.form.author,
            deadline: deadline == undefined ? '' : deadline,
            layout: this.form.checked ? 1 : 0,
            content: this.content,
            coverImg: this.$refs.ue.getCoverPic().url,
            tags: label,
            coverImgName: this.$refs.ue.getCoverPic().title,
            createUser: getCookie("UserId")
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
            this.$message({
              message: '创建图文成功',
              type: 'success'
            });
            setTimeout(() => {
              this.$router.push("/ChartList");
            }, 2500)
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },
      // 根据Id查询图文
      GetChartDetail() {
        axios({
          method: "get",
          url: "/v1/imageText/getImageTextById",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            id: parseUrl().id,
          }
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            let data = response.data.data;
            console.log(response.data, "根据策略id查询图文");
            this.form.title = data.title;
            this.form.author = data.author;
            this.form.time = data.deadline;
            this.form.checked = data.layout == 1 ? true : false;
            this.CoverPic.title = data.coverImgName;
            this.CoverPic.url = data.coverImg;
            this.defaultMsg = data.content;
            this.label = data.tags;
            setTimeout(() => {
              this.$refs.ue.haveUE();
            }, 10)
            console.log(this.label, "***************");
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
      this.getStates();
      this.GetChartDetail();
    },
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
