<template>
  <div style="padding-left:15px;padding-right:15px;">
    <div id="createBox" style=" margin-top:20px;height:60px;border:1px solid #dfe6ec;text-align:right;line-height:60px;padding-right:30px;">
      <el-button type="primary" @click="createVoice()">新建</el-button>
    </div>
    <div id="voiceTable" style=" margin-top:20px;">
      <template>
        <el-table border :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="名称" width="300">
            <template slot-scope="scope">
              <div>
                <aplayer class="audio" ref="player" :music="{
                  pic: '',
                  title: scope.row.title,
                  url: scope.row.link,
                }">
                </aplayer>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="时长">
          </el-table-column>
          <el-table-column prop="useType" label="用途">
            <template slot-scope="scope">
              <div>
                <el-tag style="background:#409eff;" v-if="scope.row.useType==1">策略讲解</el-tag>
                <el-tag v-else type="success">产品观点</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button size="small" @click="editVoice(scope.row)">修改</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div id="pageBox" style="text-align:right; margin-top:20px;">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :page-size="Number(Pagesize)" :current-page="Number(Pageindex)"
        :total="Number(total)">
      </el-pagination>
    </div>

    <div id="createvoicedialogBox" style="min-width:560px;height:410px;">
      <el-dialog title="新建语音" :visible.sync="dialogFormVisible1">
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
          <el-upload id="createUpload" style=" margin-top:20px;display:block" class="upload-demo dlb" :action="action" :headers="myHeaders"
            :on-remove="handleRemove" :on-success="uploadSuccess" :on-change="handleChange" :before-upload="beforeAvatarUpload"
            :file-list="fileList3">
            <div>
              <el-button size="small" type="primary">浏览</el-button>
            </div>
          </el-upload>
          <div>
            <!-- <aplayer class="audio" id="playerSuccess" ref="playerSuccess" :music="createmusic">
            </aplayer> -->
          </div>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createsumbit()">保存</el-button>
          <el-button @click="dialogFormVisible1 = false">返回</el-button>
        </div>
      </el-dialog>
    </div>



    <div id="editvoicedialogBox" style="min-width:560px;height:410px;">
      <el-dialog title="修改" :visible.sync="dialogFormVisible2">
        <el-form :model="edit">
          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input style="width:240px;" v-model="edit.title" id="edittitle" :maxlength="30" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用途" :label-width="formLabelWidth">
            <el-radio-group v-model="edit.use">
              <el-radio label="策略讲解"></el-radio>
              <el-radio label="产品观点"></el-radio>
            </el-radio-group>
          </el-form-item>

          <div class="dlb" style="margin-left:80px;">语音内容
          </div>
          <div style="width:300px;margin-left: 140px;margin-top: -22px;">
            <aplayer v-if="editmusic" id="editaplayer" ref="player" :music="editmusic">
            </aplayer>
          </div>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editsumbit()">保存</el-button>
          <el-button @click="dialogFormVisible2 = false">返回</el-button>
        </div>
      </el-dialog>
    </div>
    <div id="removedialogBox">
      <el-dialog title="删除" :visible.sync="dialogFormVisible3" width="30%">
        <span style="padding-left:60px;">确定删除此语音?</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="removeSumbit()">确 定</el-button>
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { authLoaction } from "../../../config/authKey.js";
import Aplayer from "vue-aplayer";
import {
  setStore,
  getStore,
  getCookie,
  enterAuthValited,
  setTitle
} from "../../../config/mUtils";
import loadding from "../../common/loadding.vue";
export default {
  components: {
    loadding,
    Aplayer
  },
  data() {
    return {
      editmusic: {
        title: "",
        url: "1.mp3",
        lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
      },
      createmusic: {
        title: "",
        url: "1.mp3"
      },
      myHeaders: {
        Authorization: "bearer " + getCookie("Token")
      },
      action: HOST + "/v1/voice/uploadVoice",
      create: {
        title: "",
        use: "策略讲解",
        useType: ""
      },
      edit: {
        title: "",
        use: "策略讲解",
        useType: ""
      },
      createduration: "",
      formLabelWidth: "120px",
      form: "",
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      Pagesize: 10,
      Pageindex: 1,
      total: Number,
      fileList3: [],
      tableData: [],
      voice: {
        title: "",
        url: "",
        useType: ""
      },
      editId: "",
      removeId: "",
      fileList: [],
      createVoiceSuccess: false
    };
  },
  created() {
    setTitle('音频管理')
    console.log(HOST);
    enterAuthValited("511", authLoaction, this.authMsg);
    this.query({
      pageindex: 1,
      pagesize: 10
    });
  },
  methods: {
    getObjectURL(file) {
      console.log(file);
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    authMsg() {
      this.$message({
        message: "没有权限，请联系管理员"
      });
      this.$router.push("/StrategyList");
      // this.$router.push("/Error");
    },
    //查询
    query(obj) {
      axios({
        method: "get",
        url: "/v1/voice/getVoiceList",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          useType: "",
          page: obj.pageindex,
          limit: obj.pagesize
        }
      }).then(res => {
        console.log(res.data.data, "res");
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
        this.Pageindex = obj.pageindex;
      });
      // /v1/voice/getVoiceList
    },
    //分页
    handleCurrentChange(obj) {
      console.log(obj);
      this.Pageindex = obj;
      this.query({
        pageindex: obj,
        pagesize: 10
      });
    },
    createVoice() {
      this.fileList3 = [];
      this.createVoiceSuccess = false;
      this.create.title = "";
      this.create.use = "策略讲解";
      this.create.useType = "";
      this.createduration = "";
      this.createmusic.url = "";
      this.dialogFormVisible1 = true;
    },
    editVoice(row) {
      let editInfo = this.queryVoice(row.id);
      this.dialogFormVisible2 = true;
      // voice:{
      //   title:'',
      //   url:'',
      //   useType:''
      // }
      // this.voice.title = row.title;
    },
    queryVoice(voiceId) {
      let voiceInfo;
      axios({
        method: "get",
        url: "/v1/voice/getVoiceById",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          id: voiceId
        }
      }).then(res => {
        console.log(res, "res");
        if (res.data.status == 200) {
          let data = res.data.data;
          this.edit.title = data.title;
          if (data.useType == 1) {
            this.edit.use = "策略讲解";
          } else if (data.useType == 2) {
            this.edit.use = "产品观点";
          }
          console.log(data.duration)
          this.editmusic.lrc = data.duration
          this.editId = data.id;
           $("#editaplayer audio").attr("src", data.link);
           $("#editaplayer audio").attr("duration", data.link);

          console.log(this.editmusic.url);
          this.editmusic.title = data.title;
        }
      });
    },
    //上传
    uploadSuccess(response, file, fileList) {
      this.$message({
        message: "上传音频成功"
      });
      this.fileList.push(file);
      console.log(this.fileList, "file");
      console.log(response, "duration");
      this.createduration = response.data.duration;
      this.createmusic.url = response.data.link;
      this.createmusic.title = file.name;
    },
    handleRemove() {
      this.fileList = [];
    },
    beforeAvatarUpload(file) {
      if (file.size/ 1024 / 1024 > 30) {
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
      } else {
        return true;
      }
    },
    handleChange() {},
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
              setTimeout(() => {
                this.query({
                  pageindex: 1,
                  pagesize: 10
                });
              }, 0);
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
    editsumbit() {
      if (this.edit.use == "产品观点") {
        this.edit.useType = 2;
      } else if (this.edit.use == "策略讲解") {
        this.edit.useType = 1;
      }
      axios({
        method: "post",
        url: "/v1/voice/updateVoice",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          id: this.editId,
          title: this.edit.title,
          useType: this.edit.useType,
          updateUser: getCookie("currentUserId")
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.$message({
            message: "保存成功"
          });
          this.dialogFormVisible2 = false;
          setTimeout(() => {
            this.query({
              pageindex: this.Pageindex,
              pagesize: 10
            });
          }, 0);
        } else {
          this.$message({
            message: "保存失败"
          });
        }
      });
    },
    handleDelete(row) {
      this.dialogFormVisible3 = true;
      this.removeId = row.id;
    },
    removeSumbit() {
      axios({
        method: "post",
        url: "/v1/voice/deleteVoice",
        headers: {
          Authorization: "bearer " + getCookie("Token")
        },
        params: {
          id: this.removeId
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.$message({
            message: "删除成功"
          });
          this.dialogFormVisible3 = false;
        } else {
          this.$message({
            message: "删除失败"
          });
        }
      });
      this.query({
        pageindex: this.Pageindex,
        pagesize: 10
      });
    }
  }
};
</script>

<style scoped>
.dlb {
  display: inline-block;
}

.upload-demo {
  margin-left: 150px;
}

#playerSuccess {
  display: none;
}
</style>

