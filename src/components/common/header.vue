<template>
  <div class="header" style="min-width:1140px;">
    <el-row :gutter="20" style="color:#000;">
      <el-col :span="6" :offset="14">

        <div class="grid-content bg-purple" style="text-align:  right;line-height:3;color:#32373d;font-weight:700;">您好!&nbsp;<span
            style="color:#c8161d;">{{username}}</span> [{{departName}}]&nbsp;&nbsp;<span>
            <el-dropdown @command="handleCommand">

              <i class="el-icon-setting" style="margin-right: 15px"></i>
              <el-dropdown-menu slot="dropdown" id="drop">
                <el-dropdown-item command="changePsd">修改密码</el-dropdown-item>
                <el-dropdown-item command="xinpin">信评系统</el-dropdown-item>
                <el-dropdown-item command="loginout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span></div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">
          <div style="height: 20px;color:#2ab2f2"> </div>
          <span style="color:#2ab2f2">{{time}}</span>
        </div>
      </el-col>
    </el-row>
    <el-dialog id="change" title="修改密码" :visible.sync="dialogFormVisible" @close='resert'>
      <el-form :model="form">
        <el-form-item label="原密码" :label-width="formLabelWidth">
          <el-input v-model="form.OldPsd" placeholder="请输入6位数字密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="form.NewPsd" placeholder="请输入6位数字密码"></el-input>
        </el-form-item>
        <el-form-item label="确定密码" :label-width="formLabelWidth">
          <el-input v-model="form.NewPsdOK" placeholder="请输入6位数字密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPsd">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getCookie,
    removeCookie
  } from "../../config/mUtils";
  export default {
    data() {
      return {
        form: {
          OldPsd: '',
          NewPsd: '',
          NewPsdOK: ''
        },
        formLabelWidth: '100px',
        dialogFormVisible: false,
        departName: getCookie('departName'),
        token: "",
        Account: "",
        username: getCookie('UserId'),
        time: ""
      };
    },
    mounted() {
      setInterval(() => {
        this.getCurrtime();
      }, 1000);
    },
    methods: {
      resert() {
        this.form = {
          OldPsd: '',
          NewPsd: '',
          NewPsdOK: ''
        }
      },
      // 验证密码合法
      isPsdAvailable(str) {
        var myreg = /^\d{6}$/;
        if (!myreg.test(str)) {
          return false;
        } else {
          return true;
        }
      },
      // 修改密码
      editPsd() {
        let password = getCookie('P_PSD');
        if (this.form.OldPsd != password) {
          this.$message({
            message: "请输入正确的原始密码",
            type: 'warning'
          });
        } else if (!this.isPsdAvailable(this.form.NewPsd) || !this.isPsdAvailable(this.form.NewPsdOK)) {
          this.$message({
            message: "无效密码,请重新设置",
            type: 'warning'
          });
        } else if (this.form.NewPsd != this.form.NewPsdOK) {
          this.$message({
            message: "两次输入的新密码不相同,请重新设置",
            type: 'warning'
          });
        } else {
          this.UpdateUserPwd();
        }
      },
      UpdateUserPwd() {
        axios({
          method: "post",
          url: "/v1/OrlApi/UpdateUserPwd",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          data: {
            "AccountId": getCookie("UserId"),
            "SubParam": [{
                "m_UserId": getCookie("UserId")
              },
              {
                "m_OldPwd": this.form.OldPsd
              },
              {
                "m_NewPwd": this.form.NewPsd
              }
            ]
          }
        }).then(response => {
          console.log(response, "&&&&&&&&&&&&&&&&&");
          if (response.data.ResultCode == 401) {
            this.$message({
              message: "Token已经过期"
            });
            this.$router.push("/Login");
          }
          if (response.data.ResultCode == 200) {
            this.$confirm('修改成功', {
              confirmButtonText: '确定',
              showCancelButton: false,
              showClose: false,
              type: 'success'
            }).then(() => {
              this.$router.push("/Login");
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          } else {
            this.$message({
              message: "修改密码失败",
              type: "warning"
            });
          }
        });
      },
      showPsd() {
        this.dialogFormVisible = true;
      },
      getCurrtime() {
        var a = new Date();
        var b = a.toLocaleTimeString();
        var c = a.toLocaleDateString();
        this.time = c + b;
      },
      handleCommand(command) {
        if (command == 'xinpin') {
          let urlStatic;
          if (HOST == 'http://10.21.10.192:80') {
            urlStatic = "http://10.21.10.171:8083"
          } else if (HOST == 'http://192.168.10.91:80') {
            //uat
            urlStatic = "http://192.168.10.90:82"
          } else if (HOST == 'https://api.fw-fintech.com') {
            //prod
            urlStatic = "https://creditmgr.fw-fintech.com"
          }
          console.log(urlStatic + '/#/module/createReport')
          location.href = urlStatic + '/#/module/createReport?Token=' + getCookie("Token") + '&currentUserId=' +
            getCookie('currentUserId') + '&departName=' + getCookie('departName');
        } else if (command == 'loginout') {
          axios({
            method: "post",
            url: '/v1/StrategyApi/StrategyLogOut',
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            data: {
              "AccountId": "admin",

              "SubParam": [{
                "m_Token": getCookie('Token')
              }]
            }
            // username: this.form.username,
            // password: this.form.password
          }).then(res => {
            console.log(res);
            if (res.data.ResultCode == 400) {
              this.$message({
                message: "用户名或密码错误"
              });
            } else if (res.data.ResultCode !== 200) {
              this.$router.push({
                path: "/Login"
              });
            } else {
              console.log(this)
              removeCookie('DepartmentId');
              removeCookie('RoleId');
              removeCookie('UserId');
              removeCookie('Token');
              removeCookie('auth')

              this.$router.push({
                path: "/Login"
              });
            }
          }).catch((error) => {
            if (error == 'Error: Request failed with status code 504') {
              this.$message({
                message: "服务器超时"
              });
            }
          })

        } else if (command == 'changePsd') {
          this.showPsd();
        }
      },
    }
  };

</script>
<style>
  #change .el-dialog__header {
    line-height: 0 !important;
  }

</style>
<style scoped>
  .header {
    min-width: 1080px;
    box-sizing: border-box;
    width: 100%;
    height: 66px;
    font-size: 14px;
    line-height: 66px;
    background-color: #4778c7;
    box-shadow: 2px 0 3px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    overflow: hidden;
    left: 200px;
  }

  .header .logo {
    float: left;
    cursor: pointer;
    font-size: 22px;
  }

  .loginOut {
    color: #000;
    width: 200px;
    float: right;
  }

</style>
