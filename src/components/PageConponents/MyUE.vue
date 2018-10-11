<!-- 百度富文本编辑器Ueditor -->
<template>
  <div style="margin-left: 10px">
    <el-row :gutter="20">
      <el-col :span="20">
        <div class="grid-content bg-purple">
          <div id="editorElem"></div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light" style="text-align: center;">
          <el-button type="primary" style="width: 95%;display: block;margin: 0px auto 30px" @click="selectPic(0)">图片</el-button>
          <el-button type="success" style="width: 95%;display: block;margin: 0px auto" @click="selectAudio">语音</el-button>
        </div>
      </el-col>
    </el-row>

    <Picture :ControlWindouw="ControlWindouw" @BindSave='InsertPic' @Back="Back"></Picture>
    <Audio :ControlWindouwAudio="ControlWindouwAudio" @BindSaveAudio='InsertAudio' @BackAudio="BackAudio"></Audio>
    <div class="message" style="margin-top: 20px;">
      <el-form>
        <el-form-item label="选择封面图:" :label-width="formLabelWidth">
          <span v-if="!state">{{Cover.title}}</span>
          <el-button type="primary" size="small " style="display: inline-block;margin-left: 15px" @click="selectPic(1)">选择图片</el-button>
        </el-form-item>
        <el-form-item label="输入标签:" :label-width="formLabelWidth" v-if="!state">
          <el-input style="width: 300px" placeholder="最多输入三个，请用中文分号分隔" v-model='changelabel'></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style="padding-left: 42px;box-sizing: border-box;width: 250px;" v-if="state&&Cover.url!=''">
      <!-- 图片地址是否拼接全 -->
      <div v-if='IshaveHttp(Cover.url)'>
        <img style="width: 120px" :src=Cover.url />
      </div>
      <div v-else>
        <img style="width: 120px" :src=filepath+Cover.url />
      </div>

      <!-- <el-button type="danger" size="mini">删除</el-button> -->
      <span style="display: block;text-align: left;line-height: 30px">{{Cover.title}}</span>
    </div>
    <div v-html="Allhtml" style="display: none" id="Allhtml"></div>
  </div>
</template>
<script>
  import Picture from './Picture.vue';
  import Audio from './Audio.vue';
  import Aplayer from 'vue-aplayer';
  import E from 'wangeditor';
  export default {
    components: {
      Picture,
      Audio,
      Aplayer
    },
    name: 'UE',
    data() {
      return {
        formLabelWidth: '130px',
        editor: null,
        ControlWindouw: false,
        ControlWindouwAudio: false,
        audioData: {},
        Allhtml: '',
        clickState: '',
        Cover: {},
        newValue: "",
        filepath: "",
        editorContent: '',
        imgSrc: '../../../static/images/audio.png'
      }
    },
    props: ["defaultMsg", "config", "state", "CoverPic", "label"],
    created() {
      console.log(HOST, "*************");
      // this.changelabel = this.label;
      console.log(this.label, "*******************");
      this.Cover = this.CoverPic;
      console.log(this.CoverPic, "**************");
      if (HOST == "http://10.21.10.192:80") {
        this.filepath = "http://10.21.10.170:19001/";
      } else if (HOST == "http://192.168.10.91:80") {
        this.filepath = "http://192.168.10.94:8090/";
        
      } else if (HOST == "https://api.fw-fintech.com") {
        this.filepath = "https://imgs.fw-fintech.com/";
      }
    },
    computed: {
      changelabel: {
        get: function () {
          this.newValue = this.label;
          return this.label;
        },
        set: function (newValue) {
          console.log(newValue, "**************");
          this.newValue = newValue;
        }
      }
    },
    mounted() {
      this.createUe();
    },
    methods: {


      IshaveHttp(value) {
        if (value.indexOf('http') != -1) {
          return true;
        } else {
          return false;
        }
      },
      haveUE() {
        this.editor.txt.html(this.defaultMsg);
      },

      // 创建富文本编辑器
      createUe() {
        this.editor = new E('#editorElem')
        this.editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          // 'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          // 'emoticon', // 表情
          // 'image', // 插入图片
          // 'table', // 表格
          // 'video', // 插入视频
          // 'code', // 插入代码
          'undo', // 撤销
          'redo' // 重复
        ]
        this.editor.create()
      },
      // 获取封面图对象
      getCoverPic() {
        return this.Cover;
      },
      // 获取标签
      getLabel() {
        return this.newValue;
      },
      getUEContent() { // 获取内容方法
        return this.editor.txt.html();
      },
      // 选择图片
      selectPic(data) {
        console.log(data, "**************");
        this.clickState = data; //0图文,1封面图
        this.ControlWindouw = true;
      },
      selectAudio() {
        this.ControlWindouwAudio = true;
      },
      // 插入图片
      InsertPic(data) {
        console.log(this.editor.selection.getSelectionStartElem()[0], "焦点位置");
        console.log(data, "来自图片库的图片");
        // 选择封面图
        if (this.clickState == 1) {
          if (data.length > 1) {
            this.$message({
              message: '封面图只能选择一张',
              type: 'warning'
            });
          } else {
            this.Cover = data[0];
          }
        }
        // 选择图文图片
        if (this.clickState == 0) {
          let link = '';
          data.forEach((item, index) => {
            link += '<div><img src=' + item.url + '></div>'
          });
          this.editor.txt.append(link);
          // UE.getEditor('editor').focus();
          // this.editor.execCommand('insertHtml', link);
        }

        this.ControlWindouw = false;
      },
      // 插入音频
      InsertAudio(data) {
        console.log(data, "来自音频库");
        this.audioData = data;
        let audioLink = this.audioData.link;
        this.ControlWindouwAudio = false;
        this.Allhtml = this.editor.txt.html();
        setTimeout(() => {
          let audio = document.getElementById("Allhtml").getElementsByTagName("audio")[0];
          if (audio) {
            console.log("语音存在，替换");
            this.$message({
              message: '只能插入一条音频，请先删除在重新添加',
              type: 'warning'
            });
          } else {
            console.log("语音不存在，插入");
            let link = '<div><img style="width:400px;height:80px" id="DefaultAudio" src=' + this.imgSrc +
              '><audio style="width=50%;display:none" src=' + audioLink +
              ' controls=controls></audio></div>';
            this.editor.txt.append(link);
            // UE.getEditor('editor').focus();
            // this.editor.execCommand('insertHtml', link);
          }
        }, 10)
      },
      // 点击返回按钮
      Back(data) {
        console.log("点击了返回,Pic");
        this.ControlWindouw = false;
      },
      BackAudio(data) {
        console.log(data, "点击了返回,Audio");
        this.audioData = data;
        this.ControlWindouwAudio = false;
      },
    },
    // destroyed() {
    //   this.editor.destroy();
    // }
  }

</script>
<style>
  .edui-default .edui-editor-bottomContainer {
    display: none;
  }

  .w-e-menu {
    z-index: 3 !important;
  }

  .w-e-text-container {
    z-index: 1 !important;
    min-height: 600px !important;
  }

</style>
