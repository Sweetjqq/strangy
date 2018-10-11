<!-- 音频库 -->
<template>
  <div>
    <!-- 新建语音弹窗 -->
    <div id="createvoicedialogBox">
      <el-dialog title="新建语音" :visible.sync="dialogFormVisible1" :show-close="false" :close-on-click-modal="false">
        <el-form :model="create">
          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input style="width:240px;" v-model="create.title" id="createtitle" :maxlength="30" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用途" :label-width="formLabelWidth">
            <el-radio-group v-model="create.use">
              <el-radio label="策略讲解"></el-radio>
              <el-radio label="产品观点"></el-radio>
            </el-radio-group>
          </el-form-item>

          <div class="dlb" style="margin-left:80px;">语音内容 &nbsp;&nbsp;&nbsp;格式支持mp3，文件大小不超过30M，语音时长不超过30分钟
          </div>
          <el-upload id="createUpload" style=" margin-top:20px;display:block" class="upload-demo dlb" :action="action"
            :limit='1' :file-list="fileList" :headers="myHeaders" :on-remove="handleRemove" :on-success="uploadSuccess"
            :before-upload="beforeAvatarUpload">

            <el-form-item label="" :label-width="formLabelWidth">
              <el-button size="small" type="primary">上传语音</el-button>
            </el-form-item>

          </el-upload>
          <div>
          </div>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createsumbit()">保存</el-button>
          <el-button @click="dialogFormVisible1 = false">返回</el-button>
        </div>
      </el-dialog>
    </div>



    <el-dialog size='large' title="选择语音" :show-close="false" :visible.sync="ControlWindouwAudio" :close-on-click-modal="false">
      <div style="text-align: right;margin-top: -25px;margin-bottom: 10px">
        <el-button size="small" type="primary" @click='createVoice'>新建语音</el-button>
      </div>
      <el-tabs type="border-card" v-model="clickState" @tab-click="handleClick">
        <el-tab-pane label="策略讲解">

          <el-table :data="ExplanationData" border style="width: 100%">
            <el-table-column align="center" width='80'>
              <template slot-scope="scope">
                <el-radio @change.native="getCurrentRow(scope.row)" :label="scope.$index" v-model="radio" class="textRadio">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="名称">
            </el-table-column>
            <el-table-column prop="duration" label="时长">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column width="300">
              <template slot-scope="scope">
                <div>
                  <Aplayer class="audio" ref="player" :music="{
                          pic: '',
                          title: scope.row.title,
                          src: scope.row.link,
                        }">
                  </Aplayer>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div style="float: right;margin-top: 20px;">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :page-size="Number(Pagesize)"
              :current-page="Number(Pageindex)" :total="Number(total)">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="产品观点">
          <el-table :data="ViewpointData" border style="width: 100%">
            <el-table-column align="center" width='80'>
              <template slot-scope="scope">
                <el-radio @change.native="getCurrentRow(scope.row)" :label="scope.$index" v-model="radio1" class="textRadio">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="名称">
            </el-table-column>
            <el-table-column prop="duration" label="时长">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column width='300'>
              <template slot-scope="scope">
                <div>
                  <Aplayer class="audio" ref="player" :music="{
                            pic: '',
                            title: scope.row.title,
                            src: scope.row.link,
                          }">
                  </Aplayer>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="" width='140'>
                <template slot-scope="scope">
                  <audio :src="scope.row.link" controls="controls"></audio>
                </template>
              </el-table-column> -->
          </el-table>
          <!-- 分页 -->
          <div style="float: right;margin-top: 20px;">
            <el-pagination @current-change="handleCurrentChange1" layout="prev, pager, next, jumper" :page-size="Number(Pagesize1)"
              :current-page="Number(Pageindex1)" :total="Number(total1)">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <div class="saveBtn1">
          <el-row>
            <el-button type="warning" @click="SaveAudio()" :disabled="ClickDis">确定</el-button>
            <el-button type="danger" @click="BackAudio()">取消</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    setStore,
    getStore,
    getCookie
  } from '../../config/mUtils';
  import Aplayer from 'vue-aplayer';
  export default {
    components: {
      Aplayer
    },
    //ControlWindouwAudio控制显隐
    props: ['ControlWindouwAudio'],
    data() {
      return {
        formLabelWidth: "120px",
        dialogFormVisible1: false,
        create: {
          title: "",
          use: "策略讲解",
          useType: ""
        },
        action: HOST + "/v1/voice/uploadVoice",
        myHeaders: {
          Authorization: "bearer " + getCookie("Token")
        },
        ClickDis: true,
        clickState: "0",
        Pageindex: 1,
        Pageindex1: 1,
        Pagesize: 10,
        Pagesize1: 10,
        total: "",
        total1: "",
        radio: "",
        radio1: "",
        ExplanationData: [], //策略讲解
        ViewpointData: [], //产品观点
        AudioData: {},
        createmusic: {
          title: "",
          url: ""
        },
        createduration: '',
        fileList: [],
        limit: 1
      };
    },
    computed: {},
    methods: {
      handleRemove(file, fileList) {
        this.fileList = [];
      },
      createsumbit() {
        console.log(this.createduration, "createduration");
        if (this.create.use == "产品观点") {
          this.create.useType = 2;
        } else if (this.create.use == "策略讲解") {
          this.create.useType = 1;
        }
        console.log(this.create.title);
        if (this.create.title == "") {
          this.$message({
            message: "请先输入标题"
          });
        } else {
          console.log(this.fileList, "&&&&&&&&&&&&&&&&&&&&");
          if (this.fileList.length > 0) {
            axios({
              method: "post",
              url: "/v1/voice/saveVoice",
              headers: {
                Authorization: "bearer " + getCookie("Token")
              },
              params: {
                title: this.create.title,
                useType: this.create.useType,
                duration: this.createduration,
                link: this.createmusic.url,
                createUser: getCookie("currentUserId")
              }
            }).then(res => {
              if (res.data.status == 200) {
                this.$message({
                  message: "保存成功"
                });
                this.dialogFormVisible1 = false;
                if (this.clickState == 0) {
                  this.radio = "";
                  this.ViewpointData = [];
                  this.GetAudioList(1);
                }
                if (this.clickState == 1) {
                  this.radio1 = "";
                  this.ExplanationData = [];
                  this.GetAudioList(2);
                }
                this.create.title="";
                this.create.useType=1;
                this.createduration="";
                this.createmusic.url="";
                this.fileList=[];
              } else {
                this.$message({
                  message: "保存失败"
                });
              }
            });
          } else {
            this.$message({
              message: "请先上传语音"
            });
          }
        }
      },
      createVoice() {
        this.dialogFormVisible1 = true;
      },
      //上传
      uploadSuccess(response, file, fileList) {
        console.log(response, "duration");
        if (response.status == 200) {
          this.$message({
            message: '上传语音成功',
            type: 'success'
          });
          this.fileList.push(file);
          console.log(this.fileList, "file");
          this.createduration = response.data.duration;
          this.createmusic.url = response.data.link;
          this.createmusic.title = file.name;
        } else {
          this.$message({
            message: response.msg,
            type: 'warning'
          });
        }
      },


      beforeAvatarUpload(file) {
        console.log(this.fileList, "*************");
        if (file.size / 1024 / 1024 > 30) {
          this.$message({
            message: "上传音频大小不能超过30M"
          });
          return false;
        }
        if (file && !/^audio\/(mp3|wma|wav|amr)$/.test(file.type)) {
          this.$message({
            message: "上传音频格式只能为mp3"
          });
          return false;
        }
        if (this.fileList.length > 0) {
          this.$message({
            message: "只能上传单条语音"
          });
          return false;
        } else {
          return true;
        }
      },
      // 获取语音列表
      GetAudioList(type) {
        axios({
          method: "get",
          url: "/v1/voice/getVoiceList",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            useType: type,
            page: this.clickState == 0 ? this.Pageindex : this.Pageindex1,
            limit: this.clickState == 0 ? this.Pagesize : this.Pagesize1,
          }
        }).then(response => {
          if (response.data.status == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.status == 200) {
            console.log(response.data, "获取语音列表");
            if (this.clickState == 0) {
              this.ExplanationData = response.data.data.list;
              this.total = response.data.data.total;
            }
            if (this.clickState == 1) {
              this.ViewpointData = response.data.data.list;
              this.total1 = response.data.data.total;
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        });
      },
      handleClick(tab, event) {
        console.log(this.clickState, "********************");
        // this.Pageindex =this.Pageindex1=1;
        this.ClickDis = true;
        if (this.clickState == 0) {
          this.radio = "";
          this.ViewpointData = [];
          this.GetAudioList(1);
        }
        if (this.clickState == 1) {
          this.radio1 = "";
          this.ExplanationData = [];
          this.GetAudioList(2);
        }
      },
      getCurrentRow(data) {
        console.log(data, "要使用的语音数据****************");
        this.AudioData = data;
        this.ClickDis = false;
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.Pageindex = val;
        this.GetAudioList(1);
      },
      handleCurrentChange1(val) {
        console.log(`当前页: ${val}`);


        this.Pageindex1 = val;
        this.GetAudioList(2);
      },
      //点击确定按钮，获取选择的语音,传值给父组件
      SaveAudio() {
        let data = this.AudioData;
        this.$emit("BindSaveAudio", data);
      },
      //点击返回按钮
      BackAudio() {
        this.AudioData = {};
        this.$emit("BackAudio", this.AudioData);
      }
    },
    created() {

    },
    mounted() {
      this.GetAudioList(1);
    }
  };

</script>
<style>
  /*弹窗样式*******************/

  .el-dialog__header {
    background: #6c93d2;
    padding: 15px 20px !important;
  }

  .el-dialog__header .el-dialog__title {
    color: white !important;
    font-family: "Microsoft YaHei";
  }

  .el-dialog__footer {
    background-color: #f4f4f4;
  }

  .el-dialog__footer {
    padding: 8px 20px !important;
  }

  .saveBtn1 .el-button {
    width: 100px;
  }

  .saveBtn1 .el-button:nth-child(1) {
    background: #28b6f5;
    border-color: #28b6f5;
  }

  .saveBtn1 .el-button:nth-child(2) {
    background: #bebebe;
    border-color: #bebebe;
  }

  /***********************/

</style>
