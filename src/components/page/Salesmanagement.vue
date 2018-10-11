<template>
  <div id="Salesmanagement">
    <div class="header">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label style="padding-left:20px; font-size: 14px;
    font-family: '微软雅黑';
    color: #48576a;
    font-weight: 700;">姓名</label>
            <!-- @keyup.native="validatequery()" -->
            <el-input ref="Name" v-model="Name" :maxlength="10" style="width:217px;" placeholder="请输入内容" class="ml12"></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="search()">查询</el-button>
            <el-button type="success" @click="createsales()">新建</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="body">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status==1">
              <el-tag type="success">可用</el-tag>
            </div>
            <div v-else>
              <el-tag type="danger"> 冻结</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">
              <el-button @click="edithandleClick(scope.row)" size="small" type="primary">修改</el-button>
              <el-button size="small" @click="removehandleClick(scope.row)" type="danger">冻结</el-button>
            </div>
            <div v-else>
              <el-button @click="resthandleClick(scope.row)" size="small" type="success">激活</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div style="float: right;margin: 15px 15px 0 0">
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :page-size="Number(Pagesize)" :current-page="Number(Pageindex)"
          :total="Number(total)">
        </el-pagination>
      </div>
    </div>
    <div class="footer">

    </div>
    <div>
      <div id="dialogBox">
        <el-dialog title="新建销售" :visible.sync="dialogFormVisible1">
          <el-form :model="form">
            <el-form-item label="手机" :label-width="formLabelWidth">
              <el-input style="width:240px;" :maxlength="11" id="createphone" v-model="form.phone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input style="width:240px;" :maxlength="10" id="createname" v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
              <el-input style="width:240px;" v-model="form.email" id="createemail" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="初始密码" :label-width="formLabelWidth">
              <el-input style="width:240px;" disabled v-model="randomCode" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createsumbit()">保存</el-button>
            <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>


      <div id="editdialogBox">
        <el-dialog title="修改销售" :visible.sync="dialogFormVisible2">
          <el-form :model="form">
            <el-form-item label="手机" :label-width="formLabelWidth">
              <el-input style="width:240px;" v-model="edit.phone" id="editphone" :maxlength="11" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input style="width:240px;" v-model="edit.name" id="editname" :maxlength="10" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
              <el-input style="width:240px;" v-model="edit.email" id="editemail" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editsumbit()">确定</el-button>
            <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>

    <div id="removedialogBox">
      <el-dialog title="操作" :visible.sync="dialogFormVisible3" width="30%">
        <span style="padding-left:60px;">是否冻结该用户？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="removeSumbit()">确 定</el-button>
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>


    <div id="restdialogBox">
      <el-dialog title="操作" :visible.sync="dialogFormVisible4" width="30%">
        <span style="padding-left:60px;">是否激活该用户？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="restSumbit()">确 定</el-button>
          <el-button @click="dialogFormVisible4 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import {
    authLoaction
  } from "../../config/authKey.js";
  import {
    setStore,
    getStore,
    enterAuthValited,
    getCookie
  } from "../../config/mUtils";
  export default {
    components: {},
    data() {
      return {
        Pagesize: 10,
        Pageindex: "",
        total: "",
        randomCode: "",
        value: "",
        Name: "",
        restaurants: [],
        state4: "",

        id: "",
        edit: {
          name: "",
          phone: "",
          email: ""
        },
        form: {
          name: "",
          phone: "",
          email: "",
          password: ""
        },
        removedialogBoxMessage: "",
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        dialogFormVisible4: false,
        formLabelWidth: "120px",
        options: [{
            value: "",
            label: ""
          },
          {
            value: "可用",
            label: "可用"
          },
          {
            value: "删除",
            label: "删除"
          }
        ],
        tableData: []
      };
    },
    methods: {
      search() {
        this.Pageindex = 1;

        if (this.Name) {
          if (this.validatequery()) {
            console.log($.trim(this.Name));
            this.query({
              name: $.trim(this.Name),
              type: 1,
              pageNum: 1,
              pageSize: 10
            });
          }
        } else {
          this.query({
            name: "",
            type: 1,
            pageNum: 1,
            pageSize: 10
          });
        }
      },
      validatequery() {
        let chinese = /^[\u4E00-\u9FA5]{1,10}$/;
        if (chinese.test($.trim(this.Name))) {
          console.log(true);
          return true;
        } else {
          this.showMsg("请输入中文");
          return false;
        }
      },
      validatecreate() {
        // 手机
        // 姓名
        // 邮箱
        let errorMsg = "";
        const rule = {
          createphone: {
            require: true,
            rule: true,
            exp: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            name: "手机号"
          },
          createname: {
            require: true,
            rule: true,
            exp: /^[\u4E00-\u9FA5]{1,10}$/,
            name: "姓名"
          },
          createemail: {
            require: true,
            rule: true,
            exp: /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
            name: "邮箱"
          }
        };

        $.each(rule, key => {
          const elem = rule[key];
          if (elem.require) {
            if (!$(`#${key} input`).val()) {
              errorMsg = `请输入${elem.name}`;
              return false;
            }
          }

          if (elem.exp) {
            if (!elem.exp.test($(`#${key} input`).val())) {
              errorMsg = `您的${elem.name}格式不正确，请重新输入`;
              return false;
            }
          }
        });
        return errorMsg;
      },
      validateedit() {
        // 手机
        // 姓名
        // 邮箱
        let errorMsg = "";
        const rule = {
          editphone: {
            require: true,
            rule: true,
            exp: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            name: "手机号"
          },
          editname: {
            rule: true,
            exp: /^[\u4E00-\u9FA5]{1,10}$/,
            name: "姓名"
          },
          editemail: {
            require: true,
            rule: true,
            exp: /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
            name: "邮箱"
          }
        };

        $.each(rule, key => {
          const elem = rule[key];
          if (elem.require) {
            if (!$(`#${key} input`).val()) {
              errorMsg = `请输入${elem.name}`;
              return false;
            }
          }

          if (elem.exp) {
            if (!elem.exp.test($(`#${key} input`).val())) {
              console.log($(`#${key} input`).val(), "0000000000");
              errorMsg = `您的${elem.name}格式不正确，请重新输入`;
              return false;
            }
          }
        });
        return errorMsg;
      },
      query(obj) {
        axios({
          method: "get",
          url: "/v1/pcustomer/getCustomerInfoList",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            name: obj.name || "",
            type: obj.type,
            salesManager: "",
            pageNum: obj.pageNum,
            pageSize: obj.pageSize
          }
        }).then(res => {
          console.log(res);
          if (res.data.status == 200) {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.showMsg("加载数据失败");
          }
        });
        // }
      },
      //分页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.Pageindex = val;
        this.query({
          name: this.Name,
          type: 1,
          pageNum: val,
          pageSize: 10
        });
      },
      // 点击编辑按钮
      edithandleClick(scope) {
        console.log("111");
        this.dialogFormVisible2 = true;
        console.log(scope);
        this.id = scope.id;
        this.edit.name = scope.name;
        this.edit.phone = scope.mobile;
        this.edit.email = scope.email;
      },
      // 点击冻结按钮
      removehandleClick(scope) {
        this.id = scope.id;
        this.dialogFormVisible3 = true;
      },
      resthandleClick(scope) {
        this.id = scope.id;
        this.dialogFormVisible4 = true;
      },
      // 激活
      restSumbit() {
        axios({
          method: "post",
          url: "/v1/pcustomer/updateStatus",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            status: 1,
            id: this.id
          }
        }).then(res => {
          if (res.data.status == 200) {
            this.showMsg("激活用户成功");
            this.query({
              name: "",
              type: 1,
              pageNum: this.Pageindex,
              pageSize: 10
            });
          } else {
            this.showMsg("激活用户失败");
          }
          this.dialogFormVisible4 = false;
        });
      },
      showMsg(obj) {
        this.$message({
          message: obj
        });
      },
      // 新建
      createsumbit() {
        // 1 校验格式
        // 2 发送请求
        let msg = this.validatecreate();
        console.log(msg);
        if (msg == "") {
          this.dialogFormVisible1 = false;
          axios({
            method: "post",
            url: "v1/pcustomer/saveCustomerInfo",
            // headers: {
            //   Authorization: "bearer " + getCookie("Token")
            // },
            params: {
              id: "",
              name: this.form.name,
              email: this.form.email,
              mobile: this.form.phone,
              password: this.randomCode,
              type: 1,
              salesManagerId: "",
              orgId: "",
              branchOrg: ""
            }
          }).then(res => {
            console.log(res, "111111111");
            if (res.data.status == 200) {
              this.showMsg("新建用户成功");
              this.query({
                name: "",
                type: 1,
                pageNum: this.Pageindex,
                pageSize: 10
              });
            } else {
              this.showMsg(res.data.msg);
            }
          });
        } else {
          this.showMsg(msg);
        }
      },
      // 提交修改
      editsumbit() {
        let msg = this.validateedit();
        console.log(msg);
        if (msg == "") {
          this.dialogFormVisible2 = false;
          axios({
            method: "post",
            url: "v1/pcustomer/saveCustomerInfo",
            // headers: {
            //   Authorization: "bearer " + getCookie("Token")
            // },
            params: {
              id: this.id,
              name: this.edit.name,
              email: this.edit.email,
              mobile: this.edit.phone,
              password: "",
              type: 1,
              salesManagerId: "",
              orgId: "",
              branchOrg: ""
            }
          }).then(res => {
            console.log(res);
            if (res.data.status == 200) {
              this.showMsg("修改用户成功");
              this.query({
                name: "",
                type: 1,
                pageNum: this.Pageindex,
                pageSize: 10
              });
            } else {
              this.showMsg("修改用户失败");
            }
          });
        } else {
          this.showMsg(msg);
        }
      },
      // 冻结操作
      removeSumbit() {
        axios({
          method: "post",
          url: "/v1/pcustomer/updateStatus",
          headers: {
            Authorization: "bearer " + getCookie("Token")
          },
          params: {
            status: 0,
            id: this.id
          }
        }).then(res => {
          if (res.data.status == 200) {
            this.showMsg("冻结用户成功");
            this.query({
              name: "",
              type: 1,
              pageNum: this.Pageindex,
              pageSize: 10
            });
          } else {
            this.showMsg("冻结用户失败");
          }
          this.dialogFormVisible3 = false;
        });
      },

      // 生成6位密码
      randomNum(n) {
        var str =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var n = 6,
          s = "";
        for (var i = 0; i < n; i++) {
          var rand = Math.floor(Math.random() * str.length);
          s += str.charAt(rand);
        }
        return s;
        // var t = "";
        // for (var i = 0; i < n; i++) {
        //   t += Math.floor(Math.random() * 10);
        // }
        // return t;
      },
      createsales() {
        this.form.name = "";
        this.form.phone = "";
        this.form.email = "";
        this.form.password = "";
        this.randomCode = "";
        this.dialogFormVisible1 = true;
        this.randomCode = this.randomNum(6);
      },
      authMsg() {
        this.$message({
          message: "没有权限，请联系管理员"
        });
        this.$router.push("/StrategyList");
        // this.$router.push("/Error");
      }
    },

    mounted() {
      enterAuthValited("411", authLoaction, this.authMsg);
      this.query({
        name: "",
        type: 1,
        pageNum: 1,
        pageSize: 10
      });
      setTimeout(() => {
        document.title = "销售管理";
      }, 1000);
    }
  };

</script>

<style scoped>
  .header {
    margin-top: 20px;
    min-width: 838px;
  }

  .body {
    margin: 40px 15px 0 15px;
  }

</style>
