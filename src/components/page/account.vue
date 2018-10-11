
<template>
  <div>
    <el-row style="margin-top:20px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-form ref="form" label-width="80px" @submit.native.prevent>
            <el-form-item label="用户名" style="margin-bottom:0px;    font-size: 14px; font-weight: 700;">
              <el-input v-model="accountID" @keyup.13="search(accountID)"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-form ref="form" label-width="80px">
            <el-button type="primary" style="margin-left:20px;" @click="search()">查询</el-button>
          </el-form>
        </div>
      </el-col>

    </el-row>
    <div style="  padding-left: 10px; padding-right: 10px;">
      <el-table border :data="tableData" style="width: 100% ;margin-top:30px;">
        <el-table-column prop="UserId" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="RoleName" label="用户角色">
        </el-table-column>
        <el-table-column prop="UserType" label="用户类型">
        </el-table-column>
        <el-table-column prop="DepartmentName" label="所属部门">
        </el-table-column>
        <el-table-column prop="SystemName" label="所属系统">
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleMenuEdit1(scope.$index, scope.row)">分配角色</el-button>
            <el-button size="mini" type="mini" @click="handleMenuEdit2(scope.$index, scope.row)">分配菜单权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination style="margin-top:20px;float:right" layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="current"
      :total="count">
    </el-pagination>
    <el-dialog title="分配角色" id="accoutRole" :visible.sync="dialogFormVisible1" :show-close="false" v-if="dialog1">
      <div class="block">
        <div>
          <el-tree ref='tree1' :default-checked-keys="checkedMenuAuth" :data="data1" show-checkbox node-key="RoleId" :props="props1">
          </el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel1()">取 消</el-button>
        <el-button type="primary" @click="authSumbit1()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="分配菜单权限" :visible.sync="dialogFormVisible2" :show-close="false" :close-on-click-modal="false" v-if="dialog2">
      <div>
        <el-tree ref='tree2' :default-checked-keys="checkedMenu" :data="data2" show-checkbox node-key="id">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel2()">取 消</el-button>
        <el-button type="primary" @click="authSumbit2()">确 定</el-button>
      </div>
    </el-dialog>
    <loadding v-if="showLoadding" :loaddingMsg="loaddingMsg"></loadding>

  </div>

</template>

<script>
  import {
    setStore,
    getStore,
    getCookie,
    checkpermissions,
    getCaption,
    enterAuthValited
  } from "../../config/mUtils";
  import {
    authLoaction
  } from "../../config/authKey.js";
  import {
    MenuKey,
    roles
  } from "../../config/authKey.js";
  import loadding from "../common/loadding.vue";

  export default {
    components: {
      loadding
    },
    data() {
      return {
        current: 1,
        showLoadding: false,
        loaddingMsg: "",
        dialog1: true,
        dialog2: true,
        checkedMenu: [],
        checkedMenuAuth: [],
        roles: [],
        count: 1,
        accountID: "",
        props1: {
          label: "FullName",
          id: "RoleId",
          children: "ChildrenItems"
        },
        data1: roles,
        data2: MenuKey,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogFormVisible: false,
        tableData: []
      };
    },
    created() {
      enterAuthValited("311", authLoaction, this.authMsg);
      this.quertAllAcount("", 1);
      this.queryAllRole();
      setTimeout(() => {
        document.title = "用户权限";
      }, 1000);
    },
    methods: {
      errorHandle(error) {
        if (error == "Error: Request failed with status code 504") {
          this.$message({
            message: "服务器超时"
          });
        }
      },
      authMsg() {
        this.$message({
          message: "没有权限，请联系管理员"
        });
        this.$router.push("/StrategyList");
        // this.$router.push("/Error");
      },
      //分页
      handleCurrentChange(val) {
        if (this.accountID !== "") {
          this.quertAllAcount(this.accountID, val);
        } else {
          this.quertAllAcount("", val);
          this.current = val;
        }
      },
      //获取所有角色
      queryAllRole() {
        axios({
            method: "get",
            url: "/v1/StrategyApi/GetPRolesAllNoLevel",
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            params: {
              AccountId: getCookie("UserId")
            }
          })
          .then(res => {
            this.data1 = res.data.ReturnParam;
          })
          .catch(err => {
            this.errorHandle(err);
          });

      },
      //查询所有用户
      quertAllAcount(query, index) {
        let name;
        let indexNum;
        this.current = indexNum;
        if (query) {
          name = query;
        } else {
          name = "";
        }
        if (index) {
          indexNum = index;
        } else {
          indexNum = 1;
        }
        axios({
            method: "get",
            url: "/GetPUsersPageData",
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            params: {
              AccountId: getCookie("UserId"),
              m_Pagesize: 10,
              m_Pageindex: indexNum,
              m_Name: name,
              m_SysId: "StrategySysIdentifier"
            }
          })
          .then(res => {
            if (res.data.ResultCode == 200) {
              this.tableData = res.data.ReturnParam.$values;
            } else {
              this.$message({
                message: "查询失败"
              });
            }
            console.log(res.data);
          })
          .catch(err => {
            this.errorHandle(err);
          });

        axios({
            method: "get",
            url: "/GetPUsersCount",
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            params: {
              AccountId: getCookie("UserId"),
              m_Name: name,
              m_SysId: "StrategySysIdentifier"
            }
          })
          .then(res => {

            if (res.data.ResultCode == 200) {
              console.log(res.data.ReturnParam);
              this.count = res.data.ReturnParam;
            } else if (res.data.status == 401) {
              this.$message({
                message: "Token过期"
              });
              this.$router.push("/");
            } else {
              this.$message({
                message: "查询页数失败"
              });
            }


          })
          .catch(err => {
            this.errorHandle(err);
          });
      },
      queryAllRoleAuth() {
        this.showLoadding = true;
        this.loaddingMsg = "加载中。。。。";
        this.checkedMenuAuth = [];
        axios({
            method: "get",
            url: "/GetPUserRole",
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            params: {
              AccountId: getCookie("UserId"),
              m_UserId: this.account,
              m_SysId: "StrategySysIdentifier"
            }
          })
          .then(res => {
            this.showLoadding = true;
            if (res.data.ResultCode == 200) {
              this.checkedMenuAuth = [];
              console.log(res.data.ReturnParam.$values, "*****");
              console.log(
                res.data.ReturnParam.$values.length,
                "res.data.ReturnParam.$values.length "
              );
              if (res.data.ReturnParam.$values.length > 0) {
                let arr = [];
                res.data.ReturnParam.$values.map(item => {
                  arr.push(item.RoleId);
                });
                this.checkedMenuAuth = arr;
                this.dialog1 = false;
                setTimeout(() => {
                  this.dialog1 = true;
                  this.dialogFormVisible1 = true;
                  this.showLoadding = false;
                }, 1000);
              } else {
                this.checkedMenuAuth = [];
                this.dialogFormVisible1 = true;
              }
            } else if (res.data.ResultCode == 5001) {
              this.checkedMenuAuth = [];
              this.dialogFormVisible1 = true;
              this.dialog1 = false;
              setTimeout(() => {
                this.dialog1 = true;
                this.dialogFormVisible1 = true;
                this.showLoadding = false;
              }, 1000);
            }
          })
          .catch(err => {
            this.errorHandle(err);
          });
      },
      //搜索
      search() {
        this.quertAllAcount(this.accountID, 1);
      },
      //设置用户角色
      setRoleByAccount() {
        axios({
            method: "post",
            url: "/v1/StrategyApi/SetPUserRole",
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            data: {
              AccountId: getCookie("UserId"),
              SubParam: [{
                  m_UserId: this.account
                },
                {
                  m_SysId: "StrategySysIdentifier"
                },
                {
                  m_Roles: this.$refs.tree1.getCheckedKeys()
                }
              ]
            }
          })
          .then(res => {
            if (res.data.ResultCode == 5001) {} else if (res.data.ResultCode == 200) {
              this.$message({
                message: "设置成功"
              });
              this.dialogFormVisible1 = false;
              this.search(this.accountID);
            } else {
              this.$message({
                message: "设置失败"
              });
            }
          })
          .catch(err => {
            this.errorHandle(err);
          });
      },
      //获取用户菜单权限
      GetUserPrivilegeConfigByUserId() {
        this.showLoadding = true;
        this.loaddingMsg = "加载中。。。。";
        this.checkedMenu = [];
        axios({
            method: "get",
            url: "/GetPUserPrivilegeConfigByUserId",
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            params: {
              AccountId: getCookie("UserId"),
              m_UserId: this.account,
              m_SystemId: "StrategySysIdentifier"
            }
          })
          .then(res => {
            if (res.data.ResultCode == 5001) {
              this.AddPUserPrivilegeConfig();
            } else if (res.data.ResultCode == 200) {
              this.checkedMenu = JSON.parse(
                res.data.ReturnParam.$values[0].Privilege
              ).echo;
              console.log(this.checkedMenu, "this.checkedMenu");
              this.dialog2 = false;
              setTimeout(() => {
                this.dialog2 = true;
                this.dialogFormVisible2 = true;
                this.showLoadding = false;
              }, 1000);
            }
          })
          .catch(err => {
            this.errorHandle(err);
          });
      },
      //添加用户权限
      AddPUserPrivilegeConfig() {
        let config = {
          echo: [],
          MenuKey: MenuKey
        };
        axios({
            method: "post",
            url: "/AddPUserPrivilegeConfig",
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            data: {
              AccountId: getCookie("UserId"),
              SubParam: [{
                m_UserPConfig: {
                  UserId: this.account,
                  SystemId: "StrategySysIdentifier",
                  FunctionKey: "MenuKey",
                  Privilege: JSON.stringify(config),
                  CreationTime: new Date()
                }
              }]
            }
          })
          .then(res => {
            if (res.data.ResultCode == 200) {
              setTimeout(() => {
                this.dialog = true;
                this.dialogFormVisible2 = true;
                this.showLoadding = false;
              }, 1000);
            } else {
              this.$message({
                message: "添加角色配置失败"
              });
            }
          })
          .catch(err => {
            this.errorHandle(err);
          });
      },
      //设置用户权限
      SetPUserPrivilegeConfig() {
        let config = {
          echo: this.$refs.tree2.getCheckedKeys(),
          MenuKey: MenuKey
        };
        axios({
            method: "post",
            url: "/SetPUserPrivilegeConfig",
            headers: {
              Authorization: "bearer " + getCookie("Token")
            },
            data: {
              AccountId: getCookie("UserId"),
              SubParam: [{
                m_UserPConfig: {
                  UserId: this.account,
                  SystemId: "StrategySysIdentifier",
                  FunctionKey: "MenuKey",
                  Privilege: JSON.stringify(config),
                  CreationTime: null
                }
              }]
            }
          })
          .then(res => {
            if (res.data.ResultCode == 5001) {} else if (res.data.ResultCode == 200) {
              this.$message({
                message: "设置成功"
              });
              this.search(this.accountID);
              setTimeout(() => {
                location.reload();
              }, 1000)
            }
          })
          .catch(err => {
            this.errorHandle(err);
          });
      },

      //分配角色
      authSumbit1() {
        console.log(this.$refs.tree1.getCheckedKeys());
        console.log(this.account);
        this.setRoleByAccount();
      },
      // 点击分配按钮
      handleMenuEdit1(index, row) {
        console.log(row.UserId);
        this.account = row.UserId;
        this.queryAllRoleAuth();
      },
      // 分配菜单权限
      authSumbit2() {
        console.log(this.$refs.tree2.getCheckedKeys());
        this.SetPUserPrivilegeConfig();
        this.dialogFormVisible2 = false;
      },
      // 点击分配按钮
      handleMenuEdit2(index, row) {
        this.account = row.UserId;
        this.GetUserPrivilegeConfigByUserId();
      },
      cancel1() {
        this.account = [];
        this.dialogFormVisible1 = false;
      },
      cancel2() {
        this.account = [];
        this.dialogFormVisible2 = false;
      }
    }
  };

</script>

<style scoped>
  .el-tree {
    border: 0px !important;
  }

</style>
