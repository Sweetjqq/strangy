<template>
  <div>
    <el-row style="margin-top:20px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-form ref="form" label-width="80px" @submit.native.prevent>
            <el-form-item label="角色名称" style="margin-bottom:0px;    font-size: 14px; font-weight: 700;">
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
    <div style="  padding-left: 10px;
  padding-right: 10px;">
      <el-table border :data="tableData" style="width: 100% ;margin-top:30px;">
        <el-table-column prop="RoleId" label="角色ID" width="180">
        </el-table-column>
        <el-table-column prop="FullName" label="	角色全称">
        </el-table-column>
        <el-table-column prop="Descripton" label="	角色描述">
        </el-table-column>
        <el-table-column prop="CreateTime" label="	创建日期">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleMenuEdit(scope.$index, scope.row)">分配菜单权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination style="margin-top:20px;float:right" layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="current"
      :total="count">
    </el-pagination>
    <el-dialog title="分配菜单权限" :visible.sync="dialogFormVisible" v-if="dialog">
      <div>
        <el-tree ref='tree' :default-checked-keys="checkedMenuAuth" :data="data2" show-checkbox node-key="id" :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="authSumbit()">确 定</el-button>
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
    MenuKey
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
        dialog: true,
        checkedMenuAuth: [],
        data2: MenuKey,
        defaultProps: {
          children: "children",
          label: "label"
        },
        accountID: "",
        dialogFormVisible: false,
        tableData: [],
        count: 1
      };
    },
    created() {
      enterAuthValited("312", authLoaction, this.authMsg);
      this.queryAllRole(this.accountID, 1);
    },
    mounted() {
      setTimeout(() => {
        document.title = '角色权限'
      }, 1000)
    },
    methods: {
      errorHandle(error) {
        if (error == 'Error: Request failed with status code 504') {
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
      handleCurrentChange(val) {
        if (this.accountID !== "") {
          this.queryAllRole(this.accountID, val);
        } else {
          this.queryAllRole("", val);
        }
      },
      search(accountID, ev) {
        this.queryAllRole(accountID, 1);
      },
      queryAllRole(query, val) {
        this.current = val;
        axios({
          method: "get",
          url: "/GetPRolesPageData",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            AccountId: getCookie("UserId"),
            m_Pagesize: 10,
            m_Pageindex: val,
            m_Name: query
          }
        }).then(res => {
          console.log(res);
          if (res.data.ReturnParam) {
            this.tableData = [] = res.data.ReturnParam.$values;
          } else {
            this.current = 1;
            console.log(111);
            this.tableData = [];
          }
        }).catch(err => {
          this.errorHandle(err)
        });

        axios({
          method: "get",
          url: "/GetPRolesCount",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            AccountId: getCookie("UserId"),
            m_Name: query
          }
        }).then(res => {
          console.log(res.data.ReturnParam);
          this.count = res.data.ReturnParam;
        }).catch(err => {
          this.errorHandle(err)
        });
      },
      //获取用户菜单权限
      GetPRolePrivilegeConfig() {
        this.showLoadding = true;
        this.loaddingMsg = "加载中。。。。";
        this.checkedMenu = [];
        axios({
          method: "get",
          url: "/GetPRolePrivilegeConfigSinger",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            AccountId: getCookie("UserId"),
            m_RoleId: this.account,
            m_SystemId: "StrategySysIdentifier",
            m_FunctionKey: "MenuKey"
          }
        }).then(res => {
          if (res.data.ResultCode == 5001) {
            this.AddPRolePrivilegeConfig();
          } else if (res.data.ResultCode == 200) {
            console.log(JSON.parse(res.data.ReturnParam.Privilege).echo);
            this.checkedMenuAuth = JSON.parse(
              res.data.ReturnParam.Privilege
            ).echo;
            this.dialog = false;

            setTimeout(() => {
              this.dialog = true;
              this.dialogFormVisible = true;
              this.showLoadding = false;
            }, 1000);
          }
        }).catch(err => {
          this.errorHandle(err)
        });
      },
      //添加用户权限
      AddPRolePrivilegeConfig() {
        let config = {
          echo: [],
          MenuKey: MenuKey
        };
        axios({
          method: "post",
          url: "/AddPRolePrivilegeConfig",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          data: {
            AccountId: getCookie("UserId"),
            SubParam: [{
              m_RolePConfig: {
                RoleId: this.account,
                SystemId: "StrategySysIdentifier",
                FunctionKey: "MenuKey",
                Privilege: JSON.stringify(config),
                CreationTime: new Date()
              }
            }]
          }
        }).then(res => {
          if (res.data.ResultCode == 200) {
            setTimeout(() => {
              this.dialog = true;
              this.dialogFormVisible = true;
              this.showLoadding = false;
            }, 1000);
          } else {
            this.$message({
              message: "添加角色配置失败"
            });
          }
        }).catch(err => {
          this.errorHandle(err)
        });
      },
      //设置用户权限
      SetPRolePrivilegeConfig() {
        let config = {
          echo: this.$refs.tree.getCheckedKeys(),
          MenuKey: MenuKey
        };
        axios({
          method: "post",
          url: "/v1/StrategyApi/SetPRolePrivilegeConfig",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          data: {
            AccountId: getCookie("UserId"),
            SubParam: [{
              m_RolePConfig: {
                RoleId: this.account,
                SystemId: "StrategySysIdentifier",
                FunctionKey: "MenuKey",
                Privilege: JSON.stringify(config),
                CreationTime: new Date()
              }
            }]
          }
        }).then(res => {
          if (res.data.ResultCode == 5001) {} else if (res.data.ResultCode == 200) {
            this.$message({
              message: "设置成功"
            });
            setTimeout(() => {
              location.reload();
            }, 1000)
          } else {
            this.$message({
              message: "设置失败"
            });
          }
        }).catch(err => {
          this.errorHandle(err)
        });
      },
      //分配角色
      authSumbit() {
        console.log(this.$refs.tree.getCheckedKeys());
        this.SetPRolePrivilegeConfig();
        this.dialogFormVisible = false;
      },
      handleMenuEdit(index, row) {
        console.log(row.name);
        this.account = row.RoleId;
        this.GetPRolePrivilegeConfig();
      }
    }
  };

</script>

<style scoped>
  .el-tree {
    border: 0px !important;
  }

</style>

